import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksUserConfirmation } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksUserConfirmation'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    alternativeProvider: 'metamask'
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    requestedNetwork: Network
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'on_continue_with_meta_mask' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_zeal_account_connection_request'
                  | 'add_wallet_clicked'
                  | 'on_user_confirmed_connection_with_safety_checks'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'safe_wallet_clicked'
          }
      >

export const MetaMaskSelected = ({
    alternativeProvider,
    connectionState,
    portfolioMap,
    accounts,
    customCurrencyMap,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    keystoreMap,
    sessionPassword,
    safetyChecksLoadable,
    requestedNetwork,
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                safetyChecksLoadable={safetyChecksLoadable}
                alternativeProvider={alternativeProvider}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_safety_checks_click':
                            setModalState({
                                type: 'safety_checks',
                                safetyChecks: msg.safetyChecks,
                            })
                            break
                        case 'on_account_selector_click':
                        case 'on_connect_to_zeal_click':
                            setModalState({ type: 'choose_account' })
                            break
                        case 'on_continue_with_meta_mask':
                            {
                                const safetyCheckConfirmationResult =
                                    calculateConnectionSafetyChecksUserConfirmation(
                                        { safetyChecksLoadable }
                                    )

                                switch (safetyCheckConfirmationResult.type) {
                                    case 'Failure':
                                        onMsg(msg)
                                        break

                                    case 'Success':
                                        setModalState({
                                            type: 'confirm_connection_safety_checks',
                                            safetyChecks:
                                                safetyCheckConfirmationResult.data,
                                        })
                                        break

                                    default:
                                        return notReachable(
                                            safetyCheckConfirmationResult
                                        )
                                }
                            }
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                requestedNetwork={requestedNetwork}
                safetyChecksLoadable={safetyChecksLoadable}
                installationId={installationId}
                state={modalState}
                accounts={accounts}
                alternativeProvider={alternativeProvider}
                portfolioMap={portfolioMap}
                keystoreMap={keystoreMap}
                sessionPassword={sessionPassword}
                customCurrencyMap={customCurrencyMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                currencyHiddenMap={currencyHiddenMap}
                connectionState={connectionState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'confirmation_modal_close_clicked':
                        case 'other_provider_selected':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_accounts_create_success_animation_finished':
                        case 'on_zeal_account_connection_request':
                        case 'add_wallet_clicked':
                        case 'on_user_confirmed_connection_with_safety_checks':
                        case 'hardware_wallet_clicked':
                        case 'on_account_create_request':
                        case 'track_wallet_clicked':
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
