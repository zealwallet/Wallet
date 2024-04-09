import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { SelectCurrencyAndNetwork } from '@zeal/domains/Currency/components/SelectCurrencyAndNetwork'
import { SetSlippagePopup } from '@zeal/domains/Currency/components/SetSlippagePopup'
import { BridgePollable } from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    Network,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { Portfolio } from '@zeal/domains/Portfolio'

import { SelectRoute } from './SelectRoute'

type Props = {
    account: Account
    keystoreMap: KeyStoreMap
    portfolio: Portfolio
    currenciesMatrix: CurrenciesMatrix
    pollable: BridgePollable
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    state: State
    installationId: string
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_from_network_selected'
          network: Network
      }
    | {
          type: 'on_to_network_selected'
          network: Network
      }
    | {
          type: 'on_from_currency_selected'
          currencyId: CurrencyId
      }
    | {
          type: 'on_to_currency_selected'
          currencyId: CurrencyId
      }
    | MsgOf<typeof SelectRoute>
    | Extract<
          MsgOf<typeof NetworkFilter>,
          { type: 'on_rpc_change_confirmed' | 'on_select_rpc_click' }
      >

export type State =
    | { type: 'closed' }
    | { type: 'select_from_network' }
    | { type: 'select_to_network' }
    | { type: 'select_from_network_and_currency' }
    | { type: 'select_to_network_and_currency' }
    | { type: 'select_route' }
    | { type: 'set_slippage' }

export const Modal = ({
    state,
    account,
    keystoreMap,
    portfolio,
    currenciesMatrix,
    pollable,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    installationId,
    currencyPinMap,
    onMsg,
}: Props) => {
    const fromNetworks = keys(currenciesMatrix.currencies).map((networkHexId) =>
        findNetworkByHexChainId(networkHexId, networkMap)
    )
    const toNetworks = keys(
        currenciesMatrix.currencies[
            pollable.params.fromCurrency.networkHexChainId
        ]
    ).map((networkHexId) => findNetworkByHexChainId(networkHexId, networkMap))

    const fromNetwork = findNetworkByHexChainId(
        pollable.params.fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        pollable.params.toCurrency.networkHexChainId,
        networkMap
    )

    const fromNetworksCurrent = fromNetworks.map(
        (network): CurrentNetwork => ({
            type: 'specific_network',
            network,
        })
    )

    const toNetworksCurrent = toNetworks.map(
        (network): CurrentNetwork => ({
            type: 'specific_network',
            network,
        })
    )

    switch (state.type) {
        case 'closed':
            return null

        case 'set_slippage':
            return (
                <SetSlippagePopup
                    slippagePercent={pollable.params.slippagePercent}
                    onMsg={onMsg}
                />
            )

        case 'select_route':
            return (
                <UIModal>
                    <SelectRoute
                        keystoreMap={keystoreMap}
                        pollable={pollable}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'select_from_network':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        currentNetwork={{
                            type: 'specific_network',
                            network: fromNetwork,
                        }}
                        networks={fromNetworksCurrent}
                        networkRPCMap={networkRPCMap}
                        portfolio={portfolio}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                    onMsg(msg)
                                    break

                                case 'on_network_item_click': {
                                    switch (msg.network.type) {
                                        case 'all_networks':
                                            throw new ImperativeError(
                                                'All networks is not possible on Bridge'
                                            )
                                        case 'specific_network':
                                            onMsg({
                                                type: 'on_from_network_selected',
                                                network: msg.network.network,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.network)
                                    }
                                    break
                                }
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )
        case 'select_to_network':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        currentNetwork={{
                            type: 'specific_network',
                            network: toNetwork,
                        }}
                        networks={toNetworksCurrent}
                        networkRPCMap={networkRPCMap}
                        portfolio={portfolio}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'on_network_item_click': {
                                    switch (msg.network.type) {
                                        case 'all_networks':
                                            throw new ImperativeError(
                                                'All networks is not possible on Bridge'
                                            )
                                        case 'specific_network':
                                            onMsg({
                                                type: 'on_to_network_selected',
                                                network: msg.network.network,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.network)
                                    }
                                    break
                                }

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
                </UIModal>
            )
        case 'select_from_network_and_currency':
            return (
                <UIModal>
                    <SelectCurrencyAndNetwork
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        networks={fromNetworksCurrent}
                        currencies={
                            currenciesMatrix.currencies[fromNetwork.hexChainId][
                                toNetwork.hexChainId
                            ].from
                        }
                        currentNetwork={{
                            type: 'specific_network',
                            network: fromNetwork,
                        }}
                        networkRPCMap={networkRPCMap}
                        selectedCurrencyId={pollable.params.fromCurrency.id}
                        account={account}
                        keyStoreMap={keystoreMap}
                        portfolio={portfolio}
                        knownCurrencies={currenciesMatrix.knownCurrencies}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                    onMsg(msg)
                                    break
                                case 'on_network_item_click': {
                                    switch (msg.network.type) {
                                        case 'all_networks':
                                            throw new ImperativeError(
                                                'All networks is not possible on Bridge'
                                            )
                                        case 'specific_network':
                                            onMsg({
                                                type: 'on_from_network_selected',
                                                network: msg.network.network,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.network)
                                    }
                                    break
                                }
                                case 'on_currency_selected':
                                    onMsg({
                                        type: 'on_from_currency_selected',
                                        currencyId: msg.currencyId,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )
        case 'select_to_network_and_currency':
            return (
                <UIModal>
                    <SelectCurrencyAndNetwork
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        networks={toNetworksCurrent}
                        currencies={
                            currenciesMatrix.currencies[fromNetwork.hexChainId][
                                toNetwork.hexChainId
                            ].to
                        }
                        currentNetwork={{
                            type: 'specific_network',
                            network: toNetwork,
                        }}
                        selectedCurrencyId={pollable.params.fromCurrency.id}
                        account={account}
                        keyStoreMap={keystoreMap}
                        portfolio={portfolio}
                        knownCurrencies={currenciesMatrix.knownCurrencies}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                    onMsg(msg)
                                    break

                                case 'on_network_item_click': {
                                    switch (msg.network.type) {
                                        case 'all_networks':
                                            throw new ImperativeError(
                                                'All networks is not possible on Bridge'
                                            )
                                        case 'specific_network':
                                            onMsg({
                                                type: 'on_to_network_selected',
                                                network: msg.network.network,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.network)
                                    }
                                    break
                                }

                                case 'on_currency_selected':
                                    onMsg({
                                        type: 'on_to_currency_selected',
                                        currencyId: msg.currencyId,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
