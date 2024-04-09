import { Transaction, TxData } from '@ethereumjs/tx'
import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'
import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    bigint,
    nullableOf,
    numberString,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fetchNativeBalance } from '@zeal/domains/Address/api/fetchNativeBalance'
import { OP_STACK_GAS_PRICE_ORACLE_ADDRESS } from '@zeal/domains/Address/constants'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import {
    CustomNetwork,
    Network,
    NetworkHexId,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import {
    Eip1559Fee,
    LegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    parseEIP1559Fee,
    parseLegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseEstimatedFee'

const OP_STACK_GAS_PRICE_ORACLE_ABI = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
        ],
        name: 'getL1Fee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
] as const

const PREDEFINED_OP_STACK_CUSTOM_NETWORKS: {
    networkHexId: NetworkHexId
    gasOracleAddress: Address
}[] = [
    {
        // Scroll
        networkHexId: parseNetworkHexId('0x82750').getSuccessResultOrThrow(
            'failed to parse network hex ID for Scroll network'
        ),
        gasOracleAddress: fromString(
            '0x5300000000000000000000000000000000000002'
        ).getSuccessResultOrThrow('failed to parse Scroll gas oracle address'),
    },
    {
        // opBNB
        networkHexId: parseNetworkHexId('0xcc').getSuccessResultOrThrow(
            'failed to parse network hex ID for opBNB network'
        ),
        gasOracleAddress: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
    },
    {
        // Zora
        networkHexId: parseNetworkHexId('0x76adf1').getSuccessResultOrThrow(
            'failed to parse network hex ID for Zora network'
        ),
        gasOracleAddress: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
    },
    {
        // Mantle
        networkHexId: parseNetworkHexId('0x1388').getSuccessResultOrThrow(
            'failed to parse network hex ID for Mantle network'
        ),
        gasOracleAddress: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
    },
    {
        // Blast mainnet
        networkHexId: parseNetworkHexId('0xee').getSuccessResultOrThrow(
            'failed to parse network hex ID for Blast mainnet'
        ),
        gasOracleAddress: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
    },
    {
        // Blast Sepolia
        networkHexId: parseNetworkHexId('0xa0c71fd').getSuccessResultOrThrow(
            'failed to parse network hex ID for Blast Sepolia'
        ),
        gasOracleAddress: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
    },
]

export type CustomSelectedPreset = {
    type: 'Custom'
    fee:
        | {
              type: 'LegacyCustomPresetRequestFee'
              gasPrice: string
              nonce: number
          }
        | {
              type: 'Eip1559CustomPresetRequestFee'
              maxPriorityFee: string
              maxBaseFee: string
              nonce: number
          }
}

export type FeePresetMap = Record<NetworkHexId, PredefinedPreset>

export type PredefinedPreset = { type: 'Slow' | 'Normal' | 'Fast' }

export type FeeForecastRequest = {
    network: Network
    networkRPCMap: NetworkRPCMap
    gasLimit: components['schemas']['Hexadecimal']
    gasEstimate: components['schemas']['Hexadecimal']
    address: string
    sendTransactionRequest: EthSendTransaction

    selectedPreset: PredefinedPreset | CustomSelectedPreset
}

export type FeesForecastResponseLegacyFee = {
    type: 'FeesForecastResponseLegacyFee'
    slow: LegacyFee
    normal: LegacyFee
    fast: LegacyFee
    custom: LegacyFee | null
    nonce: number
    balanceInNativeCurrency: Money
    networkState: components['schemas']['LegacyNetworkState']
    currencies: KnownCurrencies
}

export type FeesForecastResponseEip1559Fee = {
    type: 'FeesForecastResponseEip1559Fee'
    slow: Eip1559Fee
    normal: Eip1559Fee
    fast: Eip1559Fee
    custom: Eip1559Fee | null
    nonce: number
    networkState: components['schemas']['Eip1559NetworkState']
    balanceInNativeCurrency: Money
    currencies: KnownCurrencies
}

export type FeeForecastResponse =
    | FeesForecastResponseLegacyFee
    | FeesForecastResponseEip1559Fee

export const fetchFeeForecast = async ({
    signal,
    address,
    network,
    networkRPCMap,
    selectedPreset,
    gasLimit,
    gasEstimate,
    sendTransactionRequest,
}: FeeForecastRequest & {
    signal?: AbortSignal
}): Promise<FeeForecastResponse> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            const response = await post(
                '/wallet/fee/forecast',
                {
                    body: {
                        sendTransactionParams: sendTransactionRequest.params[0],
                        network: network.name,
                        address,
                        gasLimit,
                        gasEstimate,
                        selectedPreset: getSelectedPreset({ selectedPreset }),
                    },
                },
                signal
            )
            return parseFeeForecastResponse({
                response,
            }).getSuccessResultOrThrow('cannot parse ForecastRequest ')

        case 'custom':
            return fetchCustomNetworkFeeForecast({
                address,
                gasLimit,
                gasEstimate,
                network,
                networkRPCMap,
                sendTransactionRequest,
                selectedPreset,
            })

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

const getSelectedPreset = ({
    selectedPreset,
}: {
    selectedPreset: FeeForecastRequest['selectedPreset']
}): components['schemas']['FeesForecastSelectedPreset'] => {
    switch (selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            return selectedPreset
        case 'Custom':
            return {
                type: 'Custom',
                fee: selectedPreset.fee,
            }
        /* istanbul ignore next */
        default:
            return notReachable(selectedPreset)
    }
}

const parseFeeForecastResponse = ({
    response,
}: {
    response: components['schemas']['FeesForecastResponse']
}): Result<unknown, FeeForecastResponse> => {
    switch (response.type) {
        case 'FeesForecastResponseLegacyFee':
            return shape({
                type: success('FeesForecastResponseLegacyFee' as const),
                slow: parseLegacyFee(response.slow),
                normal: parseLegacyFee(response.normal),
                fast: parseLegacyFee(response.fast),
                custom: nullableOf(response.custom, parseLegacyFee),
                nonce: success(response.nonce),
                networkState: success(response.networkState),
                balanceInNativeCurrency: parseMoney(
                    response.balanceInNativeCurrency
                ),
                currencies: parseKnownCurrencies(response.currencies),
            })
        case 'FeesForecastResponseEip1559Fee':
            return shape({
                type: success('FeesForecastResponseEip1559Fee' as const),
                slow: parseEIP1559Fee(response.slow),
                normal: parseEIP1559Fee(response.normal),
                fast: parseEIP1559Fee(response.fast),
                custom: nullableOf(response.custom, parseEIP1559Fee),
                nonce: success(response.nonce),
                balanceInNativeCurrency: parseMoney(
                    response.balanceInNativeCurrency
                ),
                currencies: parseKnownCurrencies(response.currencies),
                networkState: success(response.networkState),
            })
        /* istanbul ignore next */
        default:
            return notReachable(response)
    }
}

const calculateL1Fee = async (
    transaction: EthSendTransaction,
    network: Network,
    networkRPCMap: NetworkRPCMap,
    gasOracleAddress: Address
): Promise<bigint> => {
    const txData: TxData = {
        ...transaction.params[0],
    }
    const rlpEncodedTransaction = Transaction.fromTxData(txData)
        .serialize()
        .toString('hex')

    const web3 = new Web3()
    const contract = new web3.eth.Contract(
        OP_STACK_GAS_PRICE_ORACLE_ABI,
        gasOracleAddress
    )

    const response = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: gasOracleAddress,
                    data: contract.methods
                        .getL1Fee(`0x${rlpEncodedTransaction}`)
                        .encodeABI(),
                },
                'latest',
            ],
        },
    })

    return string(response)
        .andThen((str) => bigint(str))
        .getSuccessResultOrThrow('cannot parse l1 fee')
}

const calculateGasFee = async (
    gasAmount: string,
    gasPrice: bigint,
    network: Network,
    transaction: EthSendTransaction,
    networkRPCMap: NetworkRPCMap
): Promise<bigint> => {
    const opStackCustomNetwork = PREDEFINED_OP_STACK_CUSTOM_NETWORKS.find(
        (n) => n.networkHexId === network.hexChainId
    )
    if (!opStackCustomNetwork) {
        return BigInt(gasAmount) * BigInt(gasPrice)
    }

    const l1Fee = await calculateL1Fee(
        transaction,
        network,
        networkRPCMap,
        opStackCustomNetwork.gasOracleAddress
    )
    return BigInt(gasAmount) * BigInt(gasPrice) + l1Fee
}

export const fetchCustomNetworkFeeForecast = async ({
    network,
    networkRPCMap,
    address,
    gasLimit,
    gasEstimate,
    sendTransactionRequest,
    selectedPreset,
}: {
    address: Address
    network: CustomNetwork
    networkRPCMap: NetworkRPCMap
    gasLimit: string
    gasEstimate: string
    selectedPreset: FeeForecastRequest['selectedPreset']
    sendTransactionRequest: EthSendTransaction
}): Promise<FeeForecastResponse> => {
    switch (network.trxType) {
        case 'legacy':
            const [nativeBalance, nonce, gasPrice] = await Promise.all([
                fetchNativeBalance({
                    address,
                    network,
                    networkRPCMap,
                }),
                fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_getTransactionCount',
                        params: [address, 'latest'],
                    },
                }).then((data) =>
                    numberString(data).getSuccessResultOrThrow(
                        'failed to parse custom network current nonce'
                    )
                ),
                fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_gasPrice',
                        params: [],
                    },
                }).then((data) =>
                    bigint(data).getSuccessResultOrThrow(
                        'failed to parse gas price for custom network nonce'
                    )
                ),
            ])

            const legacyPreset: LegacyFee = {
                type: 'LegacyFee',
                forecastDuration: { type: 'OutsideOfForecast' },
                gasPrice: bigIntToHex(gasPrice),
                priceInDefaultCurrency: null,
                maxPriceInDefaultCurrency: null,
                priceInNativeCurrency: {
                    amount: await calculateGasFee(
                        gasEstimate,
                        gasPrice,
                        network,
                        sendTransactionRequest,
                        networkRPCMap
                    ),
                    currencyId: network.nativeCurrency.id,
                },
                maxPriceInNativeCurrency: {
                    amount: await calculateGasFee(
                        gasLimit,
                        gasPrice,
                        network,
                        sendTransactionRequest,
                        networkRPCMap
                    ),
                    currencyId: network.nativeCurrency.id,
                },
            }

            switch (selectedPreset.type) {
                case 'Slow':
                case 'Normal':
                case 'Fast':
                    return {
                        type: 'FeesForecastResponseLegacyFee',
                        currencies: {
                            [network.nativeCurrency.id]: network.nativeCurrency,
                        },
                        networkState: {
                            type: 'LegacyNetworkState',
                            durationMs: 0,
                            maxGasPrice: '0',
                            minGasPrice: '0',
                        },
                        balanceInNativeCurrency: {
                            amount: nativeBalance,
                            currencyId: network.nativeCurrency.id,
                        },
                        nonce,
                        custom: null,
                        fast: legacyPreset,
                        normal: legacyPreset,
                        slow: legacyPreset,
                    }

                case 'Custom':
                    switch (selectedPreset.fee.type) {
                        case 'LegacyCustomPresetRequestFee':
                            return {
                                type: 'FeesForecastResponseLegacyFee',
                                currencies: {
                                    [network.nativeCurrency.id]:
                                        network.nativeCurrency,
                                },
                                networkState: {
                                    type: 'LegacyNetworkState',
                                    durationMs: 0,
                                    maxGasPrice: '0',
                                    minGasPrice: '0',
                                },
                                balanceInNativeCurrency: {
                                    amount: nativeBalance,
                                    currencyId: network.nativeCurrency.id,
                                },
                                nonce: selectedPreset.fee.nonce,
                                custom: {
                                    type: 'LegacyFee',
                                    forecastDuration: {
                                        type: 'OutsideOfForecast',
                                    },
                                    gasPrice: selectedPreset.fee.gasPrice,
                                    priceInDefaultCurrency: null,
                                    maxPriceInDefaultCurrency: null,
                                    priceInNativeCurrency: {
                                        amount: await calculateGasFee(
                                            gasEstimate,
                                            BigInt(selectedPreset.fee.gasPrice),
                                            network,
                                            sendTransactionRequest,
                                            networkRPCMap
                                        ),
                                        currencyId: network.nativeCurrency.id,
                                    },
                                    maxPriceInNativeCurrency: {
                                        amount: await calculateGasFee(
                                            gasLimit,
                                            BigInt(selectedPreset.fee.gasPrice),
                                            network,
                                            sendTransactionRequest,
                                            networkRPCMap
                                        ),
                                        currencyId: network.nativeCurrency.id,
                                    },
                                },
                                fast: legacyPreset,
                                normal: legacyPreset,
                                slow: legacyPreset,
                            }

                        case 'Eip1559CustomPresetRequestFee':
                            throw new ImperativeError(
                                'Impossible state, got custom eip1559 preset for legacy trx type network'
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(selectedPreset.fee)
                    }

                /* istanbul ignore next */
                default:
                    return notReachable(selectedPreset)
            }

        case 'eip1559':
            throw new ImperativeError(
                'Custom network with eip1559 fees are not supported'
            )

        default:
            return notReachable(network.trxType)
    }
}
