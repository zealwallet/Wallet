import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { SelectCurrencyAndNetwork } from '@zeal/domains/Currency/components/SelectCurrencyAndNetwork'
import { SetSlippagePopup } from '@zeal/domains/Currency/components/SetSlippagePopup'
import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SelectRoute } from './SelectRoute'
import { SubmitSwap } from './SubmitSwap'

type Props = {
    state: State

    portfolio: Portfolio

    fromAccount: Account
    sessionPassword: string

    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap

    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    currenciesMatrix: CurrenciesMatrix
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'select_from_currency' }
    | { type: 'select_to_currency' }
    | { type: 'select_network' }
    | { type: 'select_route' }
    | { type: 'execute_swap'; route: SwapRoute }
    | { type: 'set_slippage' }

type Msg =
    | { type: 'close' }
    | { type: 'on_from_currency_selected'; currencyId: CurrencyId }
    | { type: 'on_to_currency_selected'; currencyId: CurrencyId }
    | Extract<
          MsgOf<typeof SelectCurrencyAndNetwork>,
          { type: 'close' | 'on_network_selected' }
      >
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof SelectRoute>
    | MsgOf<typeof SubmitSwap>

export const Modal = ({
    state,
    pollable,
    currenciesMatrix,
    fromAccount,
    accountsMap,
    installationId,
    keystoreMap,
    sessionPassword,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    const networksId = keys(currenciesMatrix.currencies)
    const currentNetworks = networksId.map(
        (networkId): CurrentNetwork => ({
            type: 'specific_network',
            network: findNetworkByHexChainId(networkId, networkMap),
        })
    )

    const network = findNetworkByHexChainId(
        pollable.params.fromCurrency.networkHexChainId,
        networkMap
    )

    const currencyIds =
        currenciesMatrix.currencies[network.hexChainId][network.hexChainId].from

    switch (state.type) {
        case 'closed':
            return null

        case 'set_slippage':
            return (
                <SetSlippagePopup
                    slippagePercent={pollable.params.swapSlippagePercent}
                    onMsg={onMsg}
                />
            )

        case 'select_to_currency':
            return (
                <UIModal>
                    <SelectCurrencyAndNetwork
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        account={fromAccount}
                        currencies={currencyIds}
                        currentNetwork={{ type: 'specific_network', network }}
                        networkRPCMap={networkRPCMap}
                        keyStoreMap={keystoreMap}
                        knownCurrencies={currenciesMatrix.knownCurrencies}
                        selectedCurrencyId={
                            pollable.params.toCurrency?.id || null
                        }
                        networks={currentNetworks}
                        portfolio={portfolio}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_network_item_click':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                    onMsg(msg)
                                    break
                                case 'on_currency_selected':
                                    onMsg({
                                        type: 'on_to_currency_selected',
                                        currencyId: msg.currencyId,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        case 'select_from_currency':
            return (
                <UIModal>
                    <SelectCurrencyAndNetwork
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        account={fromAccount}
                        currencies={currencyIds}
                        currentNetwork={{ type: 'specific_network', network }}
                        networkRPCMap={networkRPCMap}
                        keyStoreMap={keystoreMap}
                        knownCurrencies={currenciesMatrix.knownCurrencies}
                        selectedCurrencyId={pollable.params.fromCurrency.id}
                        networks={currentNetworks}
                        portfolio={portfolio}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_network_item_click':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                    onMsg(msg)
                                    break

                                case 'on_currency_selected': {
                                    onMsg({
                                        type: 'on_from_currency_selected',
                                        currencyId: msg.currencyId,
                                    })
                                    break
                                }

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        case 'select_network':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={fromAccount}
                        keyStoreMap={keystoreMap}
                        currentNetwork={{
                            type: 'specific_network',
                            network,
                        }}
                        networkRPCMap={networkRPCMap}
                        networks={currentNetworks}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
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

        case 'execute_swap':
            return (
                <UIModal>
                    <SubmitSwap
                        gasCurrencyPresetMap={gasCurrencyPresetMap}
                        portfolio={portfolio}
                        feePresetMap={feePresetMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        route={state.route}
                        account={fromAccount}
                        accountsMap={accountsMap}
                        installationId={installationId}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
