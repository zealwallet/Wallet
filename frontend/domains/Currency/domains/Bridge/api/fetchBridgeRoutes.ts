import { get, post } from '@zeal/api/socketApi'
import Big from 'big.js'

import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { values } from '@zeal/toolkit/Object'
import {
    array,
    bigint,
    combine,
    match,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { fromString as parseAddress } from '@zeal/domains/Address/helpers/fromString'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { DEFAULT_CURRENCY_ID } from '@zeal/domains/Currency/constants'
import {
    BridgeRequest,
    BridgeRoute,
    BridgeRouteRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import {
    findNetworkByHexChainId,
    findNetworkByNumber,
} from '@zeal/domains/Network/constants'
import {
    getNativeAddressByNetworkId,
    getNativeTokenAddress,
} from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

const SOCKET_NATIVE_TOKEN_ADDRESS = parseAddress(
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
).getSuccessResultOrThrow('Failed to parse constant socket native address')

type SocketBridgeStep = {
    type: 'bridge'
    protocol: {
        name: string
        displayName: string
        icon: string
    }
    protocolFees: {
        feesInUsd: number
    }
}

type SocketUserTxStep = { type: 'unknown' } | SocketBridgeStep

type SocketRouteUserTx = {
    steps: SocketUserTxStep[]
    serviceTime: number

    approvalData: {
        minimumApprovalAmount: bigint
        approvalTokenAddress: Address
        allowanceTarget: Address
        owner: Address
    } | null

    toAsset: {
        address: Address
        network: Network
    }
}

type SocketBridgeRoute = {
    usedBridgeName: string
    userTx: SocketRouteUserTx
    toAmount: bigint
    outputValueInUsd: number
    inputValueInUsd: number
    totalGasFeesInUsd: number

    originalRoute: unknown
}

type SocketRefuelData = {
    fromAmount: bigint
    toAmount: bigint
    originalRefuelData: unknown
}

const parseSocketUserTxStep = (
    input: unknown
): Result<unknown, SocketUserTxStep> =>
    oneOf(input, [
        object(input).andThen((obj) =>
            shape({
                type: match(obj.type, 'bridge' as const),
                protocol: object(obj.protocol).andThen((protoObj) =>
                    shape({
                        name: string(protoObj.name),
                        displayName: string(protoObj.displayName),
                        icon: string(protoObj.icon),
                    })
                ),
                protocolFees: object(obj.protocolFees).andThen((protoFeesObj) =>
                    shape({
                        feesInUsd: number(protoFeesObj.feesInUsd),
                    })
                ),
            })
        ),
        success({ type: 'unknown' as const }),
    ])

const parseSocketRouteUserTx = (
    input: unknown
): Result<unknown, SocketRouteUserTx> =>
    object(input).andThen((obj) =>
        shape({
            steps: array(obj.steps).andThen((stepsArr) =>
                combine(stepsArr.map(parseSocketUserTxStep))
            ),
            serviceTime: number(obj.serviceTime),
            toAsset: object(obj.toAsset).andThen((toAssetObj) =>
                shape({
                    address: string(toAssetObj.address).andThen(parseAddress),
                    network: number(toAssetObj.chainId).map((id) =>
                        findNetworkByNumber(id)
                    ),
                }).map(({ address, network }) => ({
                    network,
                    address:
                        address === SOCKET_NATIVE_TOKEN_ADDRESS
                            ? getNativeTokenAddress(network)
                            : address,
                }))
            ),
            approvalData: nullableOf(obj.approvalData, (approvalData) =>
                object(approvalData).andThen((approvalObj) =>
                    shape({
                        minimumApprovalAmount: bigint(
                            approvalObj.minimumApprovalAmount
                        ),
                        approvalTokenAddress: string(
                            approvalObj.approvalTokenAddress
                        ).andThen(parseAddress),
                        allowanceTarget: string(
                            approvalObj.allowanceTarget
                        ).andThen(parseAddress),
                        owner: string(approvalObj.owner).andThen(parseAddress),
                    })
                )
            ),
        })
    )

const parseSocketRoute = (input: unknown): Result<unknown, SocketBridgeRoute> =>
    object(input).andThen((obj) =>
        shape({
            usedBridgeName: array(obj.usedBridgeNames)
                .map(([name]) => name)
                .andThen(string),

            userTx: array(obj.userTxs)
                .map(([tx]) => tx)
                .andThen(parseSocketRouteUserTx),

            toAmount: bigint(obj.toAmount),

            outputValueInUsd: number(obj.outputValueInUsd),
            inputValueInUsd: number(obj.inputValueInUsd),
            totalGasFeesInUsd: number(obj.totalGasFeesInUsd),

            originalRoute: success(input),
        })
    )

const parseSocketRefuelData = (
    input: unknown
): Result<unknown, SocketRefuelData | null> =>
    nullableOf(input, (input) =>
        object(input).andThen((obj) =>
            shape({
                toAmount: bigint(obj.toAmount),
                fromAmount: bigint(obj.fromAmount),
                originalRefuelData: success(input),
            })
        )
    )

const buildBridgeTransaction = ({
    socketBridgeRoute,
    fromAccount,
    socketRefuelData,
    signal,
}: {
    fromAccount: Account
    socketBridgeRoute: SocketBridgeRoute
    socketRefuelData: SocketRefuelData | null
    signal?: AbortSignal
}): Promise<EthSendTransaction> =>
    post(
        '/build-tx',
        {
            route: socketBridgeRoute.originalRoute,
            refuel: socketRefuelData?.originalRefuelData || null,
        },
        signal
    ).then((response) => {
        const trx = object(response)
            .andThen((obj) =>
                shape({
                    txData: string(obj.txData),
                    txTarget: string(obj.txTarget).andThen(parseAddress),
                    value: bigint(obj.value).map((value) => {
                        return `0x${value.toString(16)}` // Some RPC may fail if value contains leading zeros https://github.com/trufflesuite/ganache/issues/166
                    }),
                })
            )
            .getSuccessResultOrThrow('Failed to parse socket build tx')

        return {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_sendTransaction',
            params: [
                {
                    data: trx.txData,
                    to: trx.txTarget,
                    from: fromAccount.address,
                    value: trx.value,
                },
            ],
        }
    })

// TODO This one is copy of one in swap, maybe can be moved and reused
const fetchCurrentAllowance = ({
    approvalData,
    networkHexId,
    signal,
}: {
    approvalData: NonNullable<SocketRouteUserTx['approvalData']>
    networkHexId: NetworkHexId
    signal?: AbortSignal
}): Promise<bigint> =>
    get(
        '/approval/check-allowance',
        {
            chainID: BigInt(networkHexId).toString(10),
            owner: approvalData.owner,
            allowanceTarget: approvalData.allowanceTarget,
            tokenAddress: approvalData.approvalTokenAddress,
        },
        signal
    ).then((data) =>
        object(data)
            .andThen((obj) => bigint(obj.value))
            .getSuccessResultOrThrow(
                'Failed to parse socket allowance check response'
            )
    )

// TODO This one is also almost same with one used in swap. Probably can be reused instead of copy
const buildAllowanceTransaction = async ({
    socketBridgeRoute,
    networkHexId,
    signal,
}: {
    socketBridgeRoute: SocketBridgeRoute
    networkHexId: NetworkHexId
    signal?: AbortSignal
}): Promise<EthSendTransaction | null> => {
    const { approvalData } = socketBridgeRoute.userTx

    if (!approvalData) {
        return null
    }

    const currentAllowance = await fetchCurrentAllowance({
        approvalData,
        networkHexId: networkHexId,
        signal,
    })

    if (currentAllowance >= approvalData.minimumApprovalAmount) {
        return null
    }

    return get(
        '/approval/build-tx',
        {
            chainID: BigInt(networkHexId).toString(10),
            owner: approvalData.owner,
            allowanceTarget: approvalData.allowanceTarget,
            tokenAddress: approvalData.approvalTokenAddress,
            amount: approvalData.minimumApprovalAmount.toString(10),
        },
        signal
    ).then((response) => {
        const transaction = object(response)
            .andThen((obj) =>
                shape({
                    data: string(obj.data),
                    from: string(obj.from).andThen(parseAddress),
                    to: string(obj.to).andThen(parseAddress),
                })
            )
            .getSuccessResultOrThrow(
                'Failed to parse socket build allowance transaction'
            )

        return {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_sendTransaction',
            params: [
                {
                    data: transaction.data,
                    from: transaction.from,
                    to: transaction.to,
                },
            ],
        }
    })
}

const mapSocketBridgeRouteToBridgeRoute = async ({
    socketRoute,
    fromAmount,
    fromCurrency,
    knownCurrencies,
    socketRefuel,
    fromAccount,
    networkMap,
    signal,
}: {
    socketRoute: SocketBridgeRoute
    socketRefuel: SocketRefuelData | null
    fromAmount: bigint
    fromCurrency: CryptoCurrency
    knownCurrencies: KnownCurrencies
    fromAccount: Account
    networkMap: NetworkMap
    signal?: AbortSignal
}): Promise<BridgeRequest> => {
    const bridgeStep =
        socketRoute.userTx.steps.find((step): step is SocketBridgeStep => {
            switch (step.type) {
                case 'unknown':
                    return false
                case 'bridge':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(step)
            }
        }) || null

    if (!bridgeStep) {
        throw new ImperativeError('Failed to find brdige step in steps')
    }

    const defaultCurrency = knownCurrencies[DEFAULT_CURRENCY_ID] || null

    if (!defaultCurrency) {
        throw new ImperativeError(
            'Failed to find default currency in dictionary'
        )
    }

    const allCurrenciesArray = values(knownCurrencies)

    const toCurrency =
        allCurrenciesArray.find((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false
                case 'CryptoCurrency':
                    return (
                        currency.address ===
                            socketRoute.userTx.toAsset.address &&
                        currency.networkHexChainId ===
                            socketRoute.userTx.toAsset.network.hexChainId
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        }) || null

    if (!toCurrency) {
        throw new ImperativeError(
            `Failed to find toCurrency in dictionary ${socketRoute.userTx.toAsset.address}`
        )
    }

    const fromNativeCurrency =
        allCurrenciesArray.find((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false
                case 'CryptoCurrency':
                    return (
                        currency.address ===
                            getNativeTokenAddress(
                                findNetworkByHexChainId(
                                    fromCurrency.networkHexChainId,
                                    networkMap
                                )
                            ) &&
                        currency.networkHexChainId ===
                            fromCurrency.networkHexChainId
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        }) || null

    const toNativeCurrency =
        allCurrenciesArray.find((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false
                case 'CryptoCurrency':
                    return (
                        currency.address ===
                            getNativeTokenAddress(
                                findNetworkByHexChainId(
                                    toCurrency.networkHexChainId,
                                    networkMap
                                )
                            ) &&
                        currency.networkHexChainId ===
                            toCurrency.networkHexChainId
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        }) || null

    if (!fromNativeCurrency || !toNativeCurrency) {
        throw new ImperativeError(
            `From or To native currencies are not found in dictionary [from:${fromNativeCurrency?.id}] [to:${toNativeCurrency?.id}]`
        )
    }

    const [sourceTransaction, approvalTransaction] = await Promise.all([
        buildBridgeTransaction({
            fromAccount,
            socketBridgeRoute: socketRoute,
            socketRefuelData: socketRefuel,
            signal,
        }),
        buildAllowanceTransaction({
            socketBridgeRoute: socketRoute,
            networkHexId: fromCurrency.networkHexChainId,
            signal,
        }),
    ])

    const bridgeRoute: BridgeRoute = {
        displayName: bridgeStep.protocol.displayName,
        icon: bridgeStep.protocol.icon,
        name: socketRoute.usedBridgeName,
        serviceTimeMs: socketRoute.userTx.serviceTime * 1000,
        from: { amount: fromAmount, currencyId: fromCurrency.id },
        fromPriceInDefaultCurrency: {
            amount: BigInt(
                Math.round(
                    socketRoute.inputValueInUsd * 10 ** defaultCurrency.fraction
                )
            ),
            currencyId: defaultCurrency.id,
        },
        to: { amount: socketRoute.toAmount, currencyId: toCurrency.id },

        toPriceInDefaultCurrency: {
            amount: BigInt(
                Math.round(
                    socketRoute.outputValueInUsd *
                        10 ** defaultCurrency.fraction
                )
            ),
            currencyId: defaultCurrency.id,
        },
        feeInDefaultCurrency: {
            amount: BigInt(
                Math.round(
                    socketRoute.totalGasFeesInUsd *
                        10 ** defaultCurrency.fraction
                )
            ),
            currencyId: defaultCurrency.id,
        },
        refuel: socketRefuel && {
            from: {
                amount: socketRefuel.fromAmount,
                currencyId: fromNativeCurrency.id,
            },
            to: {
                amount: socketRefuel.toAmount,
                currencyId: toNativeCurrency.id,
            },
        },
        approvalTransaction,
        sourceTransaction,
    }

    const usedCurrencies = [
        fromCurrency,
        toCurrency,
        fromNativeCurrency,
        toNativeCurrency,
        defaultCurrency,
    ].reduce((hash, currency) => {
        hash[currency.id] = currency
        return hash
    }, {} as KnownCurrencies)

    return {
        type: 'bridge_request',
        route: bridgeRoute,
        knownCurrencies: usedCurrencies,
    }
}

export const fetchBridgeRoutes = async ({
    fromAmount,
    fromCurrency,
    knownCurrencies,
    refuel,
    fromAccount,
    slippagePercent,
    toCurrency,
    networkMap,
    signal,
}: BridgeRouteRequest & { signal?: AbortSignal }): Promise<BridgeRequest[]> => {
    const fromAmountBigInt = BigInt(
        Big(fromAmount || '0')
            .mul(Big(10).pow(fromCurrency.fraction))
            .toFixed(0)
    )

    if (fromAmountBigInt === 0n) {
        return []
    }

    const socketRoutes = object(
        await get(
            '/quote',
            {
                singleTxOnly: true,
                bridgeWithGas: refuel,

                fromChainId: fromCurrency.networkHexChainId,
                toChainId: toCurrency.networkHexChainId,

                fromTokenAddress:
                    fromCurrency.address ===
                    getNativeAddressByNetworkId(
                        fromCurrency.networkHexChainId,
                        networkMap
                    )
                        ? SOCKET_NATIVE_TOKEN_ADDRESS
                        : fromCurrency.address,

                toTokenAddress:
                    toCurrency.address ===
                    getNativeAddressByNetworkId(
                        toCurrency.networkHexChainId,
                        networkMap
                    )
                        ? SOCKET_NATIVE_TOKEN_ADDRESS
                        : toCurrency.address,

                fromAmount: fromAmountBigInt.toString(10),
                userAddress: fromAccount.address,
                recipient: fromAccount.address,
                sort: 'output',
                defaultSwapSlippage: slippagePercent.toFixed(2),
                defaultBridgeSlippage: slippagePercent.toFixed(2),
            },
            signal
        )
    )
        .andThen((obj) =>
            shape({
                routes: array(obj.routes).andThen((routes) =>
                    combine(routes.map(parseSocketRoute))
                ),
                refuel: parseSocketRefuelData(obj.refuel),
            })
        )
        .getSuccessResultOrThrow(
            'Failed to parse socket bridge quote routes in response'
        )

    const usedBridgeNames = new Set<string>()

    const uniqBridgesRoutes = socketRoutes.routes.reduce((arr, route) => {
        if (!usedBridgeNames.has(route.usedBridgeName)) {
            usedBridgeNames.add(route.usedBridgeName)
            arr.push(route)
        }

        return arr
    }, [] as SocketBridgeRoute[])

    const result = await Promise.allSettled(
        uniqBridgesRoutes.map((route) =>
            mapSocketBridgeRouteToBridgeRoute({
                fromAccount,
                fromAmount: fromAmountBigInt,
                fromCurrency,
                knownCurrencies,
                signal,
                socketRefuel: socketRoutes.refuel,
                socketRoute: route,
                networkMap,
            })
        )
    )

    // allSettled above never rejects; we want to bail if request aborted
    if (signal && signal.aborted) {
        // TODO @resetko-zeal find better solution to this
        throw new ImperativeError('Aborted')
    }

    const errors = result
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((p) => p.reason)
    if (errors.length) {
        captureError(
            new ImperativeError(
                `BRIDGE route build trx failed ${JSON.stringify(
                    errors
                )} from (${fromCurrency.networkHexChainId}, ${
                    fromCurrency.symbol
                }) to ${toCurrency.networkHexChainId}, ${toCurrency.symbol}}`
            )
        )
    }

    return result
        .filter(
            (r): r is PromiseFulfilledResult<BridgeRequest> =>
                r.status === 'fulfilled'
        )
        .map((promise) => promise.value)
}
