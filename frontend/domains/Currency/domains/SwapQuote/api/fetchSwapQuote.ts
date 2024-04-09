import { get, post } from '@zeal/api/socketApi'
import { Big } from 'big.js'

import { isNonEmptyArray } from '@zeal/toolkit/NonEmptyArray'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    array,
    bigint,
    combine,
    failure,
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
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

import { SwapQuote, SwapQuoteRequest, SwapRoute } from '../SwapQuote'

const SOCKET_NATIVE_TOKEN_ADDRESS = parseAddress(
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
).getSuccessResultOrThrow('Failed to parse constant socket native address')

type SocketSwapRoute = {
    usedDexName: string
    toAmount: bigint
    outputValueInUsd: number
    userTxs: {
        approvalData: {
            minimumApprovalAmount: bigint
            approvalTokenAddress: Address
            allowanceTarget: Address
            owner: Address
        } | null
        gasFees: {
            gasAmount: bigint
            feesInUsd: number
        }
        protocol: {
            displayName: string
            icon: string
        }
    }
    originalRoute: unknown
}

const parseGasFees = (
    input: unknown
): Result<unknown, SocketSwapRoute['userTxs']['gasFees']> =>
    object(input).andThen((obj) =>
        shape({
            gasAmount: bigint(obj.gasAmount),
            feesInUsd: number(obj.feesInUsd),
        })
    )

const parseApprovalData = (
    input: unknown
): Result<unknown, SocketSwapRoute['userTxs']['approvalData']> =>
    nullableOf(input, (inp) =>
        object(inp).andThen((obj) =>
            shape({
                minimumApprovalAmount: bigint(obj.minimumApprovalAmount),
                approvalTokenAddress: string(obj.approvalTokenAddress).andThen(
                    parseAddress
                ),
                allowanceTarget: string(obj.allowanceTarget).andThen(
                    parseAddress
                ),
                owner: string(obj.owner).andThen(parseAddress),
            })
        )
    )

const parseUserTx = (
    input: unknown
): Result<unknown, SocketSwapRoute['userTxs']> =>
    object(input).andThen((obj) =>
        shape({
            gasFees: parseGasFees(obj.gasFees),
            approvalData: parseApprovalData(obj.approvalData),
            protocol: object(obj.protocol).andThen((obj) =>
                shape({
                    displayName: string(obj.displayName),
                    icon: string(obj.icon),
                })
            ),
        })
    )

const parseSwapSocketRoute = (
    input: unknown
): Result<unknown, SocketSwapRoute[]> =>
    oneOf(input, [
        parseNonEmptySwapSocketRoute(input),
        parseEmptySwapSocketRoute(input),
    ])

const parseEmptySwapSocketRoute = (
    input: unknown
): Result<unknown, SocketSwapRoute[]> =>
    array(input).andThen((result) => {
        if (isNonEmptyArray(result)) {
            return failure({ type: 'unexpected_non_empty_array' })
        }

        return success([])
    })

const parseNonEmptySwapSocketRoute = (
    input: unknown
): Result<unknown, SocketSwapRoute[]> =>
    object(input).andThen((dto) =>
        array(dto.routes).andThen((routesInput) =>
            combine(
                routesInput.map((item) =>
                    object(item).andThen((obj) =>
                        shape({
                            outputValueInUsd: number(obj.outputValueInUsd),
                            originalRoute: success(item),
                            usedDexName: string(obj.usedDexName),
                            toAmount: bigint(obj.toAmount),
                            userTxs: array(obj.userTxs).andThen(([txInput]) =>
                                parseUserTx(txInput)
                            ),
                        })
                    )
                )
            )
        )
    )

const fetchSocketRoutes = ({
    network,
    fromAccount,
    amount,
    fromTokenAddress,
    toTokenAddress,
    signal,
    swapSlippagePercent,
}: {
    fromAccount: Account
    network: Network
    fromTokenAddress: Address
    toTokenAddress: Address
    amount: string
    swapSlippagePercent: number
    signal?: AbortSignal
}) => {
    const chainId = network.hexChainId

    return get(
        '/quote',
        {
            fromChainId: chainId,
            toChainId: chainId,

            fromTokenAddress:
                fromTokenAddress === getNativeTokenAddress(network)
                    ? SOCKET_NATIVE_TOKEN_ADDRESS
                    : fromTokenAddress,
            toTokenAddress:
                toTokenAddress === getNativeTokenAddress(network)
                    ? SOCKET_NATIVE_TOKEN_ADDRESS
                    : toTokenAddress,
            fromAmount: amount,
            userAddress: fromAccount.address,
            sort: 'output',
            defaultSwapSlippage: swapSlippagePercent.toFixed(2),
            defaultBridgeSlippage: swapSlippagePercent.toFixed(2),
        },
        signal
    ).then((data) =>
        parseSwapSocketRoute(data).getSuccessResultOrThrow(
            'Failed to parse routes from socket'
        )
    )
}

const buildAllowanceTransaction = async ({
    socketRoute,
    networkHexID,
    signal,
}: {
    socketRoute: SocketSwapRoute
    networkHexID: NetworkHexId
    signal?: AbortSignal
}): Promise<EthSendTransaction | null> => {
    const { approvalData } = socketRoute.userTxs

    if (!approvalData) {
        return null
    }

    const currentAllowance = await get(
        '/approval/check-allowance',
        {
            chainID: BigInt(networkHexID).toString(10),
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

    if (currentAllowance >= approvalData.minimumApprovalAmount) {
        return null
    }

    return get(
        '/approval/build-tx',
        {
            chainID: BigInt(networkHexID).toString(10),
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

const buildSwapTransaction = ({
    socketRoute,
    fromAccount,
    signal,
}: {
    fromAccount: Account
    socketRoute: SocketSwapRoute
    signal?: AbortSignal
}): Promise<EthSendTransaction> =>
    post('/build-tx', { route: socketRoute.originalRoute }, signal).then(
        (response) => {
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
        }
    )

const mapSocketSwapRouteToSwapRoute = async ({
    knownCurrencies,
    socketRoute,
    signal,
    fromCurrency,
    fromAccount,
    networkMap,
    toCurrency,
}: {
    socketRoute: SocketSwapRoute
    knownCurrencies: KnownCurrencies
    fromCurrency: CryptoCurrency
    fromAccount: Account
    toCurrency: CryptoCurrency
    networkMap: NetworkMap
    signal?: AbortSignal
}): Promise<SwapRoute> => {
    const defaultCurrency = knownCurrencies[DEFAULT_CURRENCY_ID] || null

    if (!defaultCurrency) {
        throw new ImperativeError(
            'Failed to find default currency in dictionary'
        )
    }

    const [approvalTransaction, swapTransaction] = await Promise.all([
        buildAllowanceTransaction({
            socketRoute,
            networkHexID: fromCurrency.networkHexChainId,
            signal,
        }),
        buildSwapTransaction({
            fromAccount,
            socketRoute,
            signal,
        }),
    ])

    return {
        dexName: socketRoute.usedDexName,
        estimatedGasFeeInDefaultCurrency: {
            amount: BigInt(
                Math.round(
                    socketRoute.userTxs.gasFees.feesInUsd *
                        10 ** defaultCurrency.fraction
                )
            ),
            currencyId: defaultCurrency.id,
        },
        network: findNetworkByHexChainId(
            fromCurrency.networkHexChainId,
            networkMap
        ),
        priceInDefaultCurrency: {
            amount: BigInt(
                Math.round(
                    socketRoute.outputValueInUsd *
                        10 ** defaultCurrency.fraction
                )
            ),
            currencyId: defaultCurrency.id,
        },
        toAmount: socketRoute.toAmount,
        toCurrencyId: toCurrency.id,
        approvalTransaction,
        swapTransaction,
        protocolDisplayName: socketRoute.userTxs.protocol.displayName,
        protocolIcon: socketRoute.userTxs.protocol.icon,
    }
}

export const fetchSwapQuote = async ({
    fromCurrency,
    portfolio,
    amount,
    toCurrency,
    fromAccount,
    signal,
    swapSlippagePercent,
    networkMap,
    knownCurrencies,
}: SwapQuoteRequest & { signal?: AbortSignal }): Promise<SwapQuote> => {
    if (!toCurrency) {
        return {
            bestReturnRoute: null,
            routes: [],
            knownCurrencies: portfolio.currencies,
        }
    }

    const power = Big(10).pow(fromCurrency.fraction)

    const toAmount = amount ? Big(amount).mul(power).toFixed(0) : '0'

    const socketSwapRoutes = await fetchSocketRoutes({
        fromAccount,
        amount: toAmount,
        fromTokenAddress: fromCurrency.address,
        network: findNetworkByHexChainId(
            fromCurrency.networkHexChainId,
            networkMap
        ),
        toTokenAddress: toCurrency.address,
        swapSlippagePercent,
        signal,
    })

    const result = await Promise.allSettled(
        socketSwapRoutes.map((socketRoute) =>
            mapSocketSwapRouteToSwapRoute({
                fromAccount,
                fromCurrency,
                toCurrency,
                socketRoute,
                knownCurrencies,
                networkMap,
                signal,
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
            new ImperativeError(`SWAP route build trx failed`, {
                errors: JSON.stringify(errors),
            })
        )
    }

    const swapRoutes = result
        .filter(
            (r): r is PromiseFulfilledResult<SwapRoute> =>
                r.status === 'fulfilled'
        )
        .map((r) => r.value)

    return {
        routes: swapRoutes,
        bestReturnRoute: swapRoutes[0],
        knownCurrencies,
    }
}
