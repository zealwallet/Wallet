import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

import { Connected as ConnectedState } from '../../../../ConnectionState'

type Props = {
    connectionState: ConnectedState
    accounts: AccountsMap

    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap
    selectedAccount: Account
    networkMap: NetworkMap
    alternativeProvider: AlternativeProvider
    currencyHiddenMap: CurrencyHiddenMap

    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string
    keystores: KeyStoreMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'disconnect_button_click'
                  | 'on_minimize_click'
                  | 'use_meta_mask_instead_clicked'
          }
      >
    | Extract<
          ModalMsg,
          {
              type:
                  | 'account_item_clicked'
                  | 'on_network_item_click'
                  | 'add_new_account_click'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_continue_with_meta_mask'
                  | 'safe_wallet_clicked'
          }
      >

export const Expanded = ({
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    connectionState,
    portfolioMap,
    alternativeProvider,
    keystores,
    accounts,
    customCurrencyMap,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    const portfolio = getPortfolio({
        address: selectedAccount.address,
        portfolioMap,
    })

    return (
        <>
            <Layout
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                portfolio={portfolio}
                selectedNetwork={selectedNetwork}
                selectedAccount={selectedAccount}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'account_selector_click':
                            setModalState({ type: 'account_selector' })
                            break
                        case 'network_selector_click':
                            postUserEvent({
                                type: 'ConnectedNetworkSelectorEnteredEvent',
                                installationId,
                            })
                            setModalState({ type: 'network_selector' })
                            break
                        case 'disconnect_button_click':
                        case 'on_minimize_click':
                        case 'use_meta_mask_instead_clicked':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                connectionState={connectionState}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                state={modalState}
                networks={values(networkMap)}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                accounts={accounts}
                selectedAccount={selectedAccount}
                portfolioMap={portfolioMap}
                keystores={keystores}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_connect_to_metamask_click':
                            setModalState({ type: 'account_selector' })
                            break

                        case 'account_item_clicked':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break
                        case 'on_network_item_click':
                            postUserEvent({
                                type: 'ConnectedNetworkSelectedEvent',
                                installationId,
                            })
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break
                        case 'other_provider_selected':
                            setModalState({ type: 'meta_mask_selected' })
                            break
                        case 'on_continue_with_meta_mask':
                        case 'on_account_create_request':
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'safe_wallet_clicked':
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
