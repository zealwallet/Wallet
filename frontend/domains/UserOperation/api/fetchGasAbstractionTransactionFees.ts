import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fetchCryptoCurrencies } from '@zeal/domains/Currency/api/fetchCryptoCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { fetchCrossRates } from '@zeal/domains/FXRate/api/fetchCrossRates'
import { fetchRate2 } from '@zeal/domains/FXRate/api/fetchRate'
import { applyRate2 } from '@zeal/domains/FXRate/helpers/applyRate'
import { CryptoMoney } from '@zeal/domains/Money'
import { isGreaterThan2 } from '@zeal/domains/Money/helpers/compare'
import { mulByNumber2 } from '@zeal/domains/Money/helpers/mul'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthCall, EthSendTransaction } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { fetchGasAbstractionCurrencies } from '@zeal/domains/UserOperation/api/fetchGasAbstractionCurrencies'
import { calculateGasEstimates } from '@zeal/domains/UserOperation/helpers/calculateGasEstimates'

import { fetchCurrentEntrypointNonce } from './fetchCurrentEntrypointNonce'

import {
    ERC20GasAbstractionTransactionFee,
    GasAbstractionTransactionFee,
} from '../GasAbstractionTransactionFee'
import { ethSendTransactionToMetaTransactionData } from '../helpers/ethSendTransactionToMetaTransactionData'
import { metaTransactionDatasToUserOperationCallData } from '../helpers/metaTransactionDatasToUserOperationCallData'
import { MetaTransactionData } from '../MetaTransactionData'
import { InitialUserOperation } from '../UserOperation'

const APPROVAL_SOFT_CAP_BUFFER = 2 // If allowance is less than soft cap buffer we include approval for hard cap buffer
const APPROVAL_HARD_CAP_BUFFER = 5

const ERC20_ALLOWANCE_ABI = {
    constant: true,
    inputs: [
        {
            name: '_owner',
            type: 'address',
        },
        {
            name: '_spender',
            type: 'address',
        },
    ],
    name: 'allowance',
    outputs: [
        {
            name: '',
            type: 'uint256',
        },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
}

const ERC20_APPROVE_ABI = {
    constant: false,
    inputs: [
        {
            name: '_spender',
            type: 'address',
        },
        {
            name: '_value',
            type: 'uint256',
        },
    ],
    name: 'approve',
    outputs: [
        {
            name: '',
            type: 'bool',
        },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
}

type ApprovalRequired = {
    type: 'approval_required'
    approvalMetaTransactionData: MetaTransactionData
}

const checkIfApprovalIsRequired = async ({
    address,
    feeAmount,
    spenderAddress,
    network,
    networkRPCMap,
    signal,
}: {
    address: Address
    spenderAddress: Address
    feeAmount: CryptoMoney
    networkRPCMap: NetworkRPCMap
    network: Network
    signal?: AbortSignal
}): Promise<
    | ApprovalRequired
    | {
          type: 'approval_not_required'
      }
> => {
    const softCap = mulByNumber2(feeAmount, APPROVAL_SOFT_CAP_BUFFER)
    const hardCap = mulByNumber2(feeAmount, APPROVAL_HARD_CAP_BUFFER)

    const request: EthCall = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
            {
                to: feeAmount.currency.address,
                data: new Web3().eth.abi.encodeFunctionCall(
                    ERC20_ALLOWANCE_ABI,
                    [address, spenderAddress]
                ),
            },
            'latest',
        ],
    }

    const currentAllowanceAmount = await fetchRPCResponse({
        signal,
        network: network,
        networkRPCMap,
        request,
    }).then((response) =>
        bigint(response).getSuccessResultOrThrow(
            'Failed to parse ERC20 allowance'
        )
    )

    const allowance: CryptoMoney = {
        currency: feeAmount.currency,
        amount: currentAllowanceAmount,
    }

    if (isGreaterThan2(allowance, softCap)) {
        return {
            type: 'approval_not_required',
        }
    } else {
        const request: EthSendTransaction = {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_sendTransaction',
            params: [
                {
                    from: address,
                    to: feeAmount.currency.address,
                    data: new Web3().eth.abi.encodeFunctionCall(
                        ERC20_APPROVE_ABI,
                        [spenderAddress, bigIntToHex(hardCap.amount)]
                    ),
                    value: '0x0',
                },
            ],
        }

        return {
            type: 'approval_required',
            approvalMetaTransactionData:
                ethSendTransactionToMetaTransactionData(request),
        }
    }
}

export const fetchGasAbstractionTransactionFees = async ({
    portfolio,
    network,
    initCode,
    metaTransactionDatas,
    sender,
    verificationGasLimitBuffer,
    entrypoint,
    networkRPCMap,
    dummySignature,
    signal,
}: {
    portfolio: Portfolio | null
    metaTransactionDatas: MetaTransactionData[]
    initCode: string | null
    entrypoint: Address
    network: Network
    networkRPCMap: NetworkRPCMap
    verificationGasLimitBuffer: bigint
    sender: Address
    dummySignature: string
    signal?: AbortSignal
}): Promise<GasAbstractionTransactionFee[]> => {
    const nativeTokenAddress = getNativeTokenAddress(network)

    const [[nativeCurrency], nonce, nativeToDefaultRate] = await Promise.all([
        fetchCryptoCurrencies({
            currencies: [{ network, addresses: [nativeTokenAddress] }],
        }),
        fetchCurrentEntrypointNonce({
            network,
            entrypoint,
            address: sender,
            networkRPCMap,
            signal,
        }),
        fetchRate2({
            network,
            tokenAddress: nativeTokenAddress,
        }),
    ])

    if (!nativeCurrency) {
        throw new ImperativeError(
            'We failed to fetch native currency data for network',
            { network: network.hexChainId }
        )
    }

    const callData = metaTransactionDatasToUserOperationCallData({
        metaTransactionDatas,
    })

    const initialUserOperation: InitialUserOperation = {
        type: 'initial_user_operation',
        callData,
        initCode,
        nonce,
        sender,
        entrypoint,
    }

    const gasCalculationResponse = await calculateGasEstimates({
        initialUserOperation,
        metaTransactionDatas,
        network,
        networkRPCMap,
        verificationGasLimitBuffer,
        dummySignature,
    })

    const {
        gasPrice,
        nonPaymasterGasEstimate,
        tokenPaymasterWithApprovalGasEstimate,
        tokenPaymasterWithoutApprovalGasEstimate,
    } = gasCalculationResponse

    const feeInNativeTokenCurrency: CryptoMoney = {
        currency: nativeCurrency,
        amount: nonPaymasterGasEstimate.totalGas * gasPrice.maxFeePerGas,
    }

    const feeInDefaultCurrency = nativeToDefaultRate
        ? applyRate2({
              baseAmount: feeInNativeTokenCurrency,
              rate: nativeToDefaultRate,
          })
        : null

    const nativeCurrencyOption = {
        type: 'native_gas_abstraction_transaction_fee' as const,
        feeInTokenCurrency: feeInNativeTokenCurrency,
        feeInDefaultCurrency,
        gasPrice,
        gasEstimate: {
            callGasLimit: nonPaymasterGasEstimate.callGasLimit,
            verificationGasLimit: nonPaymasterGasEstimate.verificationGasLimit,
            preVerificationGas: nonPaymasterGasEstimate.preVerificationGas,
        },
        callData,
    }

    const { paymasterAddress, currencies } =
        await fetchGasAbstractionCurrencies({
            network,
            dummySignature,
            initialUserOperation,
            feeAndGasEstimates: {
                gasPrice: gasCalculationResponse.gasPrice,
                gasEstimate: gasCalculationResponse.nonPaymasterGasEstimate,
            },
        })

    const crossRates = await fetchCrossRates({
        network,
        signal,
        pairs: currencies.map((currency) => ({
            fromAddress: nativeCurrency.address,
            toAddress: currency.address,
        })),
    })

    const erc20Options: (ERC20GasAbstractionTransactionFee | null)[] =
        await Promise.all(
            currencies.map(async (gasAbstractionCurrency) => {
                const crossRate = crossRates.find(
                    (crossRate) =>
                        crossRate.quote.id === gasAbstractionCurrency.id
                )

                if (!crossRate) {
                    return null
                }

                const nonApprovalFeeInNativeToken: CryptoMoney = {
                    currency: gasAbstractionCurrency,
                    amount:
                        tokenPaymasterWithoutApprovalGasEstimate.totalGas *
                        gasPrice.maxFeePerGas,
                }

                const nonApprovalFeeInUSD = nativeToDefaultRate
                    ? applyRate2({
                          baseAmount: nonApprovalFeeInNativeToken,
                          rate: nativeToDefaultRate,
                      })
                    : null

                const nonApprovalFeeInERC20 = applyRate2({
                    baseAmount: nonApprovalFeeInNativeToken,
                    rate: crossRate,
                })

                const erc20OptionWithoutApproval = {
                    type: 'erc20_gas_abstraction_transaction_fee' as const,
                    feeInTokenCurrency: nonApprovalFeeInERC20,
                    feeInDefaultCurrency: nonApprovalFeeInUSD,
                    gasPrice,
                    gasEstimate: tokenPaymasterWithoutApprovalGasEstimate,
                    callData,
                }

                const isInPortfolio =
                    !!portfolio &&
                    portfolio.tokens
                        .map((t) => t.address)
                        .includes(gasAbstractionCurrency.address)

                if (!isInPortfolio) {
                    return erc20OptionWithoutApproval
                }

                const approvalCheckResult = await checkIfApprovalIsRequired({
                    feeAmount: nonApprovalFeeInERC20,
                    address: sender,
                    spenderAddress: paymasterAddress,
                    network,
                    networkRPCMap,
                    signal,
                })

                switch (approvalCheckResult.type) {
                    case 'approval_not_required':
                        return erc20OptionWithoutApproval
                    case 'approval_required': {
                        const withApprovalFeeInNativeToken: CryptoMoney = {
                            currency: gasAbstractionCurrency,
                            amount:
                                tokenPaymasterWithApprovalGasEstimate.totalGas *
                                gasPrice.maxFeePerGas,
                        }

                        const withApprovalFeeInUSD = nativeToDefaultRate
                            ? applyRate2({
                                  baseAmount: withApprovalFeeInNativeToken,
                                  rate: nativeToDefaultRate,
                              })
                            : null

                        const withApprovalFeeInERC20 = applyRate2({
                            baseAmount: withApprovalFeeInNativeToken,
                            rate: crossRate,
                        })

                        return {
                            type: 'erc20_gas_abstraction_transaction_fee' as const,
                            feeInTokenCurrency: withApprovalFeeInERC20,
                            feeInDefaultCurrency: withApprovalFeeInUSD,
                            gasPrice,
                            gasEstimate: tokenPaymasterWithApprovalGasEstimate,
                            callData:
                                metaTransactionDatasToUserOperationCallData({
                                    metaTransactionDatas: [
                                        ...metaTransactionDatas,
                                        approvalCheckResult.approvalMetaTransactionData,
                                    ],
                                }),
                        }
                    }
                    /* istanbul ignore next */
                    default:
                        return notReachable(approvalCheckResult)
                }
            })
        )

    const erc20OptionsWithNullsRemoved = erc20Options.filter(
        (feeOption): feeOption is ERC20GasAbstractionTransactionFee =>
            feeOption !== null
    )

    return [nativeCurrencyOption, ...erc20OptionsWithNullsRemoved]
}
