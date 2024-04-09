import React, { useState } from 'react'

import { Modal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'

import { SecretPhrase } from '@zeal/domains/KeyStore'
import { LockScreenPopup } from '@zeal/domains/Password/features/LockScreenPopup'

import { ViewSecretPhrase } from './ViewSecretPhrase'

type Props = {
    encryptedPassword: string
    keystore: SecretPhrase
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'enter_password' }
    | { type: 'view_secret_phrase'; sessionPassword: string }

type Msg = { type: 'close' }

export const Flow = ({ encryptedPassword, keystore, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'enter_password' })

    switch (state.type) {
        case 'enter_password':
            return (
                <LockScreenPopup
                    encryptedPassword={encryptedPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'session_password_decrypted':
                                setState({
                                    type: 'view_secret_phrase',
                                    sessionPassword: msg.sessionPassword,
                                })
                                break

                            case 'lock_screen_close_click':
                                onMsg({ type: 'close' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'view_secret_phrase':
            return (
                <Modal>
                    <ViewSecretPhrase
                        keyStore={keystore}
                        sessionPassword={state.sessionPassword}
                        onMsg={onMsg}
                    />
                </Modal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
