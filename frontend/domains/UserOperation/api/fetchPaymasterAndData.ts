import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { object, Result, string } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import {
    BundlerGasEstimate,
    BundlerGasPrice,
    ERC20GasAbstractionTransactionFee,
    InitialUserOperation,
} from '@zeal/domains/UserOperation'
import { fetchPaymasterResponse } from '@zeal/domains/UserOperation/api/fetchPaymasterResponse'

const parse = (input: unknown): Result<unknown, string> =>
    object(input).andThen((obj) => string(obj.paymasterAndData))

export const fetchERC20PaymasterAndData = async ({
    userOperationRequest,
    selectedFee,
    nonce,
    network,
    signal,
}: {
    userOperationRequest: SimulatedUserOperationRequest
    nonce: bigint
    selectedFee: ERC20GasAbstractionTransactionFee
    network: Network
    signal?: AbortSignal
}): Promise<string> => {
    switch (network.type) {
        // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
        case 'predefined':
        case 'testnet':
            return fetchPaymasterResponse({
                network,
                signal,
                request: {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0',
                    method: 'pm_sponsorUserOperation',
                    params: [
                        {
                            sender: userOperationRequest.account.address,
                            nonce: bigIntToHex(nonce),
                            initCode: userOperationRequest.initCode || '0x',
                            callData: selectedFee.callData,
                            maxFeePerGas: bigIntToHex(
                                selectedFee.gasPrice.maxFeePerGas
                            ),
                            maxPriorityFeePerGas: bigIntToHex(
                                selectedFee.gasPrice.maxPriorityFeePerGas
                            ),
                            callGasLimit:
                                selectedFee.gasEstimate.callGasLimit.toString(),
                            verificationGasLimit:
                                selectedFee.gasEstimate.verificationGasLimit.toString(),
                            preVerificationGas:
                                selectedFee.gasEstimate.preVerificationGas.toString(),
                        },
                        {
                            mode: 'ERC20',
                            calculateGasLimits: false,
                            tokenInfo: {
                                feeTokenAddress:
                                    selectedFee.feeInTokenCurrency.currency
                                        .address,
                            },
                        },
                    ],
                },
            }).then((response) =>
                parse(response).getSuccessResultOrThrow(
                    'Failed to parse ERC20 paymaster and data response'
                )
            )
        case 'custom':
            throw new ImperativeError('Custom network not supported')
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

export const fetchSponsorshipPaymasterAndData = async ({
    initialUserOperation,
    bundlerGasPrice,
    gasEstimate,
    network,
    dummySignature,
    signal,
}: {
    initialUserOperation: InitialUserOperation
    bundlerGasPrice: BundlerGasPrice
    gasEstimate: BundlerGasEstimate
    network: Network
    dummySignature: string
    signal?: AbortSignal
}): Promise<string> => {
    switch (network.type) {
        // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
        case 'predefined':
        case 'testnet':
            return fetchPaymasterResponse({
                network,
                signal,
                request: {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0',
                    method: 'pm_sponsorUserOperation',
                    params: [
                        {
                            sender: initialUserOperation.sender,
                            nonce: bigIntToHex(initialUserOperation.nonce),
                            initCode: initialUserOperation.initCode || '0x',
                            callData: initialUserOperation.callData,
                            maxFeePerGas: bigIntToHex(
                                bundlerGasPrice.maxFeePerGas
                            ),
                            maxPriorityFeePerGas: bigIntToHex(
                                bundlerGasPrice.maxPriorityFeePerGas
                            ),
                            callGasLimit: gasEstimate.callGasLimit.toString(),
                            verificationGasLimit:
                                gasEstimate.verificationGasLimit.toString(),
                            preVerificationGas:
                                gasEstimate.preVerificationGas.toString(),
                            signature: dummySignature,
                        },
                        {
                            mode: 'SPONSORED',
                            calculateGasLimits: false,
                            sponsorshipInfo: {
                                smartAccountInfo: {
                                    name: 'BICONOMY',
                                    version: '2.0.0',
                                },
                            },
                        },
                    ],
                },
            }).then((response) =>
                parse(response).getSuccessResultOrThrow(
                    'Failed to parse SPONSORED paymaster and data response'
                )
            )
        case 'custom':
            throw new ImperativeError('Custom network not supported')
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
