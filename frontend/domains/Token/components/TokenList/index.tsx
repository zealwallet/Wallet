import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    currentNetwork: CurrentNetwork
    installationId: string
    portfolioMap: PortfolioMap
    networkMap: NetworkMap
    portfolio: Portfolio
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    keystoreMap: KeyStoreMap
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type: 'close' | 'account_filter_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_network_item_click'
                  | 'on_select_rpc_click'
                  | 'on_rpc_change_confirmed'
                  | 'on_bank_transfer_selected'
                  | 'on_bridge_clicked'
                  | 'on_send_clicked'
                  | 'on_swap_clicked'
                  | 'on_token_hide_click'
                  | 'on_token_pin_click'
                  | 'on_token_un_hide_click'
                  | 'on_token_un_pin_click'
          }
      >

export const TokenList = ({
    account,
    currentNetwork,
    portfolioMap,
    networkMap,
    portfolio,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    keystoreMap,
    customCurrencyMap,
    onMsg,
}: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'TokenListEnteredEvent',
            installationId,
        })
    }, [installationId])

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                account={account}
                portfolio={portfolio}
                selectedNetwork={currentNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_add_custom_currency_click':
                            setModalState({
                                type: 'add_custom_currency',
                                network: msg.network,
                            })
                            break

                        case 'on_show_hidden_token_click':
                            setModalState({
                                type: 'hidden_tokens',
                            })
                            break
                        case 'close':
                        case 'account_filter_click':
                            onMsg(msg)
                            break
                        case 'on_token_click':
                            setModalState({
                                type: 'send_or_receive_token',
                                currencyId: msg.token.balance.currencyId,
                            })
                            break
                        case 'network_filter_click':
                            setModalState({
                                type: 'network_filter',
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                portfolio={portfolio}
                portfolioMap={portfolioMap}
                currencyHiddenMap={currencyHiddenMap}
                customCurrencyMap={customCurrencyMap}
                currencyPinMap={currencyPinMap}
                state={modalState}
                installationId={installationId}
                account={account}
                keystoreMap={keystoreMap}
                currentNetwork={currentNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_select_rpc_click':
                        case 'on_rpc_change_confirmed':
                        case 'on_bank_transfer_selected':
                        case 'on_bridge_clicked':
                        case 'on_send_clicked':
                        case 'on_swap_clicked':
                        case 'on_token_hide_click':
                        case 'on_token_pin_click':
                        case 'on_token_un_hide_click':
                        case 'on_token_un_pin_click':
                            onMsg(msg)
                            break

                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                        case 'on_network_item_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_receive_selected':
                            setModalState({
                                type: 'receive_funds',
                            })
                            break

                        case 'on_token_click':
                            setModalState({
                                type: 'send_or_receive_token',
                                currencyId: msg.token.balance.currencyId,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
