import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    keystore: SecretPhrase
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    encryptedPassword: string
    account: Account
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_secret_phrase_verified_success'
                  | 'on_google_drive_backup_success'
          }
      >

export const Flow = ({
    account,
    accounts,
    keystoreMap,
    encryptedPassword,
    keystore,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                keystore={keystore}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_google_drive_backup_click':
                            postUserEvent({
                                type: 'RecoveryKitStartedEvent',
                                action: 'googleDrive',
                                installationId,
                            })
                            setState({ type: 'on_google_drive_backup' })
                            break
                        case 'on_write_down_secret_phrase_click':
                            postUserEvent({
                                type: 'RecoveryKitStartedEvent',
                                action: 'manual',
                                installationId,
                            })
                            setState({ type: 'on_write_down_secret_phrase' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={state}
                accounts={accounts}
                keystoreMap={keystoreMap}
                encryptedPassword={encryptedPassword}
                keystore={keystore}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_before_you_begin_back_clicked':
                        case 'on_skip_verification_click':
                        case 'on_secret_phrase_reveal_back_clicked':
                        case 'lock_screen_close_click':
                            setState({ type: 'closed' })
                            break

                        case 'on_secret_phrase_verified_success':
                            postUserEvent({
                                type: 'RecoveryKitCreatedEvent',
                                action: 'googleDrive',
                                installationId,
                            })
                            onMsg(msg)
                            break
                        case 'on_google_drive_backup_success':
                            postUserEvent({
                                type: 'RecoveryKitCreatedEvent',
                                action: 'manual',
                                installationId,
                            })
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
