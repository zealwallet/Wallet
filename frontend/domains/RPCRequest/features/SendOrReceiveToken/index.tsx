import { useState } from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    CryptoCurrency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
} from '@zeal/domains/Currency'
import { Actions } from '@zeal/domains/Currency/features/Actions'
import { AddCustom } from '@zeal/domains/Currency/features/AddCustom'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { NetworkNotSupported } from './NetworkNotSupported'

type Props = {
    installationId: string
    currencyId: CurrencyId | null
    networkMap: NetworkMap
    fromAccount: Account
    currentNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    portfolioMap: PortfolioMap
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof AddCustom>,
          {
              type:
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
          }
      >
    | Extract<
          MsgOf<typeof Actions>,
          {
              type:
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_send_clicked'
                  | 'on_receive_selected'
                  | 'on_bank_transfer_selected'
                  | 'on_token_pin_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_hide_click'
                  | 'on_token_un_hide_click'
          }
      >

type State =
    | { type: 'select_send_or_receive_token' }
    | { type: 'not_supported_network' }
    | { type: 'update_custom_currency'; currency: CryptoCurrency }

const calculateInitialState = ({
    portfolio,
    currencyId,
    currentNetwork,
    networkMap,
}: {
    currentNetwork: CurrentNetwork
    portfolio: Portfolio | null
    currencyId: CurrencyId | null
    networkMap: NetworkMap
}): State => {
    const token =
        (portfolio &&
            portfolio.tokens.find(
                (portfolioToken) =>
                    portfolioToken.balance.currencyId === currencyId
            )) ||
        null

    if (token) {
        const tokenNetwork = findNetworkByHexChainId(
            token.networkHexId,
            networkMap
        )
        switch (tokenNetwork.type) {
            case 'predefined':
            case 'testnet':
                return tokenNetwork.isZealRPCSupported
                    ? { type: 'select_send_or_receive_token' }
                    : { type: 'not_supported_network' }

            case 'custom':
                return { type: 'select_send_or_receive_token' }
            /* istanbul ignore next */
            default:
                return notReachable(tokenNetwork)
        }
    } else {
        switch (currentNetwork.type) {
            case 'all_networks':
                return { type: 'select_send_or_receive_token' }
            case 'specific_network':
                switch (currentNetwork.network.type) {
                    case 'predefined':
                    case 'testnet':
                        return currentNetwork.network.isZealRPCSupported
                            ? { type: 'select_send_or_receive_token' }
                            : { type: 'not_supported_network' }
                    case 'custom':
                        return { type: 'select_send_or_receive_token' }
                    /* istanbul ignore next */
                    default:
                        return notReachable(currentNetwork.network)
                }

            default:
                return notReachable(currentNetwork)
        }
    }
}

export const SendOrReceiveToken = ({
    currencyId,
    onMsg,
    portfolioMap,
    fromAccount,
    currentNetwork,
    networkMap,
    networkRPCMap,
    installationId,
    customCurrencies,
    currencyHiddenMap,
    currencyPinMap,
}: Props) => {
    const portfolio = getPortfolio({
        address: fromAccount.address,
        portfolioMap,
    })

    const [state, setState] = useState<State>(() =>
        calculateInitialState({
            currencyId,
            currentNetwork,
            portfolio,
            networkMap,
        })
    )

    switch (state.type) {
        case 'update_custom_currency':
            return (
                <UIModal>
                    <AddCustom
                        cryptoCurrency={state.currency}
                        network={findNetworkByHexChainId(
                            state.currency.networkHexChainId,
                            networkMap
                        )}
                        networkRPCMap={networkRPCMap}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    setState({
                                        type: 'select_send_or_receive_token',
                                    })
                                    break
                                case 'on_custom_currency_update_request':
                                case 'on_custom_currency_delete_request':
                                    setState({
                                        type: 'select_send_or_receive_token',
                                    })
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
        case 'select_send_or_receive_token':
            return (
                <Popup.Layout background="backgroundLight" onMsg={onMsg}>
                    <Actions
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        customCurrencyMap={customCurrencies}
                        fromAccount={fromAccount}
                        portfolio={portfolio}
                        currencyId={currencyId}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_swap_clicked':
                                case 'on_bridge_clicked':
                                case 'on_send_clicked':
                                case 'on_receive_selected':
                                case 'on_bank_transfer_selected':
                                case 'on_token_pin_click':
                                case 'on_token_un_pin_click':
                                case 'on_token_un_hide_click':
                                case 'on_token_hide_click':
                                    onMsg(msg)
                                    break

                                case 'on_token_settings_click':
                                    setState({
                                        type: 'update_custom_currency',
                                        currency: msg.currency,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </Popup.Layout>
            )
        case 'not_supported_network':
            return <NetworkNotSupported onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
