import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { BridgeRouteRequest } from '@zeal/domains/Currency/domains/Bridge'
import { fetchBridgeRoutes } from '@zeal/domains/Currency/domains/Bridge/api/fetchBridgeRoutes'
import { DEFAULT_SWAP_SLIPPAGE_PERCENT } from '@zeal/domains/Currency/domains/SwapQuote/constants'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    Network,
    NetworkMap,
    NetworkRPCMap,
    PredefinedNetwork,
} from '@zeal/domains/Network'
import {
    ARBITRUM,
    BASE,
    findNetworkByHexChainId,
} from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Portfolio } from '@zeal/domains/Portfolio'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

import { getCryptoCurrency } from '../helpers/getCryptoCurrency'

const DEFAULT_FROM_NETWORK: PredefinedNetwork = ARBITRUM
const DEFAULT_TO_NETWORK: PredefinedNetwork = BASE

type Props = {
    account: Account
    installationId: string
    portfolio: Portfolio
    keystoreMap: KeyStoreMap
    fromCurrencyId: CurrencyId | null
    currenciesMatrix: CurrenciesMatrix
    swapSlippagePercent: number | null
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'on_bridge_continue_clicked' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_set_slippage_percent'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
          }
      >

const selectCurrencyInNetwork = ({
    currencyIds,
    knownCurrencies,
    network,
}: {
    currencyIds: CurrencyId[]
    network: Network
    knownCurrencies: KnownCurrencies
}): CurrencyId =>
    currencyIds.find((id) => {
        const currency = knownCurrencies[id]

        if (!currency) {
            throw new ImperativeError(
                'Failed to find currency in dictionary while defaulting curency for network'
            )
        }

        switch (currency.type) {
            case 'FiatCurrency':
                return false
            case 'CryptoCurrency':
                return (
                    currency.networkHexChainId === network.hexChainId &&
                    currency.address === getNativeTokenAddress(network)
                )

            /* istanbul ignore next */
            default:
                return notReachable(currency)
        }
    }) || currencyIds[0]

const initForm = ({
    currenciesMatrix,
    fromCurrencyId,
    fromAccount,
    swapSlippagePercent,
    networkMap,
}: {
    fromAccount: Account
    fromCurrencyId: CurrencyId | null
    currenciesMatrix: CurrenciesMatrix
    swapSlippagePercent: number | null
    networkMap: NetworkMap
}): BridgeRouteRequest => {
    const { knownCurrencies, currencies } = currenciesMatrix

    if (fromCurrencyId && knownCurrencies[fromCurrencyId]) {
        const fromCurrency = getCryptoCurrency({
            cryptoCurrencyId: fromCurrencyId,
            knownCurrencies: knownCurrencies,
        })

        const toNetwork: Network =
            fromCurrency.networkHexChainId === DEFAULT_FROM_NETWORK.hexChainId
                ? DEFAULT_TO_NETWORK
                : DEFAULT_FROM_NETWORK

        const toCurrencyIds =
            currencies[fromCurrency.networkHexChainId][toNetwork.hexChainId].to

        const toCurrencyId = selectCurrencyInNetwork({
            currencyIds: toCurrencyIds,
            network: toNetwork,
            knownCurrencies,
        })

        const toCurrency = getCryptoCurrency({
            cryptoCurrencyId: toCurrencyId,
            knownCurrencies,
        })

        return {
            bridgeRouteName: null,
            fromAmount: null,
            refuel: false,
            slippagePercent:
                swapSlippagePercent || DEFAULT_SWAP_SLIPPAGE_PERCENT,
            fromCurrency,
            knownCurrencies,
            toCurrency,
            fromAccount,
            networkMap,
        }
    } else {
        const fromNetwork: Network = DEFAULT_FROM_NETWORK

        const toNetwork: Network =
            fromNetwork.hexChainId === DEFAULT_FROM_NETWORK.hexChainId
                ? DEFAULT_TO_NETWORK
                : DEFAULT_FROM_NETWORK

        const { from, to } =
            currencies[fromNetwork.hexChainId][toNetwork.hexChainId]

        const fromCurrencyId = selectCurrencyInNetwork({
            currencyIds: from,
            network: fromNetwork,
            knownCurrencies,
        })

        const toCurrencyId = selectCurrencyInNetwork({
            currencyIds: to,
            network: toNetwork,
            knownCurrencies,
        })

        return {
            bridgeRouteName: null,
            fromAmount: null,
            refuel: false,
            slippagePercent: DEFAULT_SWAP_SLIPPAGE_PERCENT,
            knownCurrencies,
            fromCurrency: getCryptoCurrency({
                cryptoCurrencyId: fromCurrencyId,
                knownCurrencies,
            }),
            toCurrency: getCryptoCurrency({
                cryptoCurrencyId: toCurrencyId,
                knownCurrencies,
            }),
            fromAccount,
            networkMap,
        }
    }
}

const setFromNetwork = ({
    newFromNetwork,
    currenciesMatrix,
    form,
    networkMap,
}: {
    newFromNetwork: Network
    currenciesMatrix: CurrenciesMatrix
    form: BridgeRouteRequest
    networkMap: NetworkMap
}): BridgeRouteRequest => {
    const { knownCurrencies } = currenciesMatrix
    const currentToNetworkHexId = form.toCurrency.networkHexChainId

    // If we can keep existing network - we keep it. If we can't we set it to Ethereum if new fromNetwork is not Ethereum or Poligon otherwise
    const newToNetworkHexId = currenciesMatrix.currencies[
        newFromNetwork.hexChainId
    ][currentToNetworkHexId]
        ? currentToNetworkHexId
        : newFromNetwork.hexChainId === DEFAULT_FROM_NETWORK.hexChainId
        ? DEFAULT_TO_NETWORK.hexChainId
        : DEFAULT_FROM_NETWORK.hexChainId

    const { from, to } =
        currenciesMatrix.currencies[newFromNetwork.hexChainId][
            newToNetworkHexId
        ]

    const fromCurrencyId = selectCurrencyInNetwork({
        currencyIds: from,
        network: newFromNetwork,
        knownCurrencies,
    })

    const toCurrencyId =
        newToNetworkHexId === currentToNetworkHexId
            ? form.toCurrency.id
            : selectCurrencyInNetwork({
                  currencyIds: to,
                  network: findNetworkByHexChainId(
                      newToNetworkHexId,
                      networkMap
                  ),
                  knownCurrencies,
              })

    return {
        bridgeRouteName: null,
        fromAmount: null,
        refuel: false,
        slippagePercent: form.slippagePercent,
        fromAccount: form.fromAccount,
        knownCurrencies: form.knownCurrencies,
        fromCurrency: getCryptoCurrency({
            cryptoCurrencyId: fromCurrencyId,
            knownCurrencies,
        }),
        toCurrency: getCryptoCurrency({
            cryptoCurrencyId: toCurrencyId,
            knownCurrencies,
        }),
        networkMap,
    }
}

const setToNetwork = ({
    newToNetwork,
    currenciesMatrix,
    form,
    networkMap,
}: {
    newToNetwork: Network
    currenciesMatrix: CurrenciesMatrix
    form: BridgeRouteRequest
    networkMap: NetworkMap
}): BridgeRouteRequest => {
    const { knownCurrencies } = currenciesMatrix

    const { to } =
        currenciesMatrix.currencies[form.fromCurrency.networkHexChainId][
            newToNetwork.hexChainId
        ]

    const toCurrencyId = selectCurrencyInNetwork({
        currencyIds: to,
        network: newToNetwork,
        knownCurrencies,
    })

    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: toCurrencyId,
        knownCurrencies,
    })

    return {
        bridgeRouteName: null,
        fromAmount: form.fromAmount,
        refuel: false,
        slippagePercent: form.slippagePercent,
        fromAccount: form.fromAccount,
        knownCurrencies: form.knownCurrencies,
        fromCurrency: form.fromCurrency,
        toCurrency,
        networkMap,
    }
}

export const Form = ({
    account,
    portfolio,
    fromCurrencyId,
    currenciesMatrix,
    keystoreMap,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    onMsg,
}: Props) => {
    const [pollable, setPollable] = usePollableData(
        fetchBridgeRoutes,
        {
            type: 'loading',
            params: initForm({
                fromCurrencyId,
                currenciesMatrix,
                swapSlippagePercent,
                fromAccount: account,
                networkMap,
            }),
        },
        {
            pollIntervalMilliseconds: 60_000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'loading':
                break
            case 'subsequent_failed':
            case 'error':
                captureError(pollable.error)
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable])

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                networkMap={networkMap}
                currenciesMatrix={currenciesMatrix}
                pollable={pollable}
                portfolio={portfolio}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_from_network_click':
                            setModalState({ type: 'select_from_network' })
                            break
                        case 'on_to_network_click':
                            setModalState({ type: 'select_to_network' })
                            break
                        case 'on_from_currency_click':
                            setModalState({
                                type: 'select_from_network_and_currency',
                            })
                            break
                        case 'on_to_currency_click':
                            setModalState({
                                type: 'select_to_network_and_currency',
                            })
                            break
                        case 'on_refuel_add_click':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    refuel: true,
                                },
                            })
                            break
                        case 'on_refuel_remove_click':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    refuel: false,
                                },
                            })
                            break
                        case 'on_route_click':
                            setModalState({ type: 'select_route' })
                            break
                        case 'on_amount_change':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    fromAmount: msg.amount,
                                },
                            })
                            break

                        case 'on_try_again_clicked':
                            setPollable({
                                type: 'loading',
                                params: pollable.params,
                            })
                            break

                        case 'on_bridge_continue_clicked':
                            onMsg(msg)
                            break

                        case 'on_slippage_clicked':
                            setModalState({ type: 'set_slippage' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                account={account}
                keystoreMap={keystoreMap}
                portfolio={portfolio}
                currenciesMatrix={currenciesMatrix}
                pollable={pollable}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_from_network_selected':
                            setModalState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: setFromNetwork({
                                    currenciesMatrix,
                                    form: pollable.params,
                                    newFromNetwork: msg.network,
                                    networkMap,
                                }),
                            })
                            return
                        case 'on_to_network_selected':
                            setModalState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: setToNetwork({
                                    currenciesMatrix,
                                    form: pollable.params,
                                    newToNetwork: msg.network,
                                    networkMap,
                                }),
                            })
                            break
                        case 'on_from_currency_selected':
                            setModalState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: {
                                    knownCurrencies:
                                        pollable.params.knownCurrencies,
                                    slippagePercent:
                                        pollable.params.slippagePercent,
                                    fromCurrency: getCryptoCurrency({
                                        cryptoCurrencyId: msg.currencyId,
                                        knownCurrencies:
                                            currenciesMatrix.knownCurrencies,
                                    }),
                                    toCurrency: pollable.params.toCurrency,
                                    bridgeRouteName: null,
                                    refuel: pollable.params.refuel,
                                    fromAmount: null,
                                    fromAccount: account,
                                    networkMap,
                                },
                            })
                            break
                        case 'on_to_currency_selected':
                            setModalState({ type: 'closed' })
                            setPollable({
                                type: 'loading',
                                params: {
                                    networkMap,
                                    knownCurrencies:
                                        pollable.params.knownCurrencies,
                                    slippagePercent:
                                        pollable.params.slippagePercent,
                                    fromCurrency: pollable.params.fromCurrency,
                                    toCurrency: getCryptoCurrency({
                                        cryptoCurrencyId: msg.currencyId,
                                        knownCurrencies:
                                            currenciesMatrix.knownCurrencies,
                                    }),
                                    bridgeRouteName: null,
                                    refuel: pollable.params.refuel,
                                    fromAmount: pollable.params.fromAmount,
                                    fromAccount: account,
                                },
                            })
                            break
                        case 'on_route_selected':
                            setModalState({ type: 'closed' })
                            setPollable({
                                ...pollable,
                                params: {
                                    ...pollable.params,
                                    bridgeRouteName: msg.route.route.name,
                                },
                            })
                            break
                        case 'on_set_slippage_percent':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    slippagePercent: msg.slippagePercent,
                                },
                            })
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
