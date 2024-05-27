import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    selectedNetwork: Network
    selectedAccount: Account
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    keystore: KeyStore
    alternativeProvider: AlternativeProvider
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_safety_checks_click'
                  | 'reject_connection_button_click'
                  | 'connect_button_click'
                  | 'use_meta_mask_instead_clicked'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_user_confirmed_connection_with_safety_checks' }
      >

export const Actions = ({
    safetyChecksLoadable,
    selectedAccount,
    selectedNetwork,
    keystore,
    alternativeProvider,
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_safety_checks_click':
                        case 'connect_button_click':
                        case 'use_meta_mask_instead_clicked':
                        case 'reject_connection_button_click':
                            onMsg(msg)
                            break

                        case 'connect_confirmation_requested':
                            setModalState({
                                type: 'confirm_connection',
                                safetyChecks: msg.safetyChecks,
                            })
                            break
                        default:
                            notReachable(msg)
                    }
                }}
                alternativeProvider={alternativeProvider}
                safetyChecksLoadable={safetyChecksLoadable}
                selectedAccount={selectedAccount}
                selectedNetwork={selectedNetwork}
                keystore={keystore}
            />

            <Modal
                installationId={installationId}
                state={modalState}
                network={selectedNetwork}
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_user_confirmed_connection_with_safety_checks':
                            onMsg(msg)
                            break

                        case 'confirmation_modal_close_clicked':
                            setModalState({ type: 'closed' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
