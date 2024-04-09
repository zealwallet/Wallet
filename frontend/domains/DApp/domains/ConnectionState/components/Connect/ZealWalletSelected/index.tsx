import React, { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    ConnectedToMetaMask,
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    connectionState:
        | DisconnectedState
        | NotInteractedState
        | ConnectedToMetaMask
    selectedNetwork: Network
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    networkRPCMap: NetworkRPCMap
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_minimize_click'
                  | 'reject_connection_button_click'
                  | 'use_meta_mask_instead_clicked'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_account_create_request'
                  | 'account_item_clicked'
                  | 'on_network_item_click'
                  | 'connected_animation_complete'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'other_provider_selected'
                  | 'safe_wallet_clicked'
          }
      >

export const ZealWalletSelected = ({
    selectedAccount,
    safetyChecksLoadable,
    accounts,
    portfolioMap,
    keystores,
    connectionState,
    selectedNetwork,
    networkRPCMap,
    customCurrencyMap,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
    alternativeProvider,
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        postUserEvent({
            type: 'ConnectionRequestedEvent',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Layout
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                keystore={getKeyStore({
                    keyStoreMap: keystores,
                    address: selectedAccount.address,
                })}
                portfolio={getPortfolio({
                    address: selectedAccount.address,
                    portfolioMap,
                })}
                safetyChecksLoadable={safetyChecksLoadable}
                connectionState={connectionState}
                selectedNetwork={selectedNetwork}
                selectedAccount={selectedAccount}
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

                        case 'on_safety_checks_click':
                            setModalState({
                                type: 'safety_checks',
                                safetyChecks: msg.safetyChecks,
                            })
                            break

                        case 'on_user_confirmed_connection_with_safety_checks':
                        case 'connect_button_click': // TODO  @max-tern ::  you don't need animation
                            setModalState({ type: 'connection_confirmation' }) // TODO @max-tern :: naming set modal to play last animation
                            break
                        case 'reject_connection_button_click':
                        case 'on_minimize_click':
                        case 'use_meta_mask_instead_clicked':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                dAppSiteInfo={connectionState.dApp}
                state={modalState}
                networks={values(networkMap)}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                selectedAccount={selectedAccount}
                accounts={accounts}
                portfolioMap={portfolioMap}
                keystores={keystores}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_network_item_click':
                            postUserEvent({
                                type: 'ConnectedNetworkSelectedEvent',
                                installationId,
                            })
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_account_create_request':
                        case 'connected_animation_complete':
                            onMsg(msg)
                            break

                        case 'account_item_clicked':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'other_provider_selected':
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
