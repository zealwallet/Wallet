import { useState } from 'react'

import { Modal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { LockScreenPopup } from '@zeal/domains/Password/features/LockScreenPopup'
import { PasswordCheckPopup } from '@zeal/domains/Password/features/PasswordCheckPopup'

import { Flow } from './Flow'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap

    encryptedPassword: string
    keystore: SecretPhrase
    account: Account
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'enter_password' }
    | { type: 'view_secret_phrase'; sessionPassword: string }

type Msg =
    | MsgOf<typeof Flow>
    | Extract<
          MsgOf<typeof PasswordCheckPopup>,
          { type: 'lock_screen_close_click' }
      >

export const PasswordChecker = ({
    encryptedPassword,
    keystore,
    account,
    accounts,
    keystoreMap,
    onMsg,
}: Props) => {
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
                                onMsg(msg)
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
                    <Flow
                        accounts={accounts}
                        keystoreMap={keystoreMap}
                        account={account}
                        keystore={keystore}
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
