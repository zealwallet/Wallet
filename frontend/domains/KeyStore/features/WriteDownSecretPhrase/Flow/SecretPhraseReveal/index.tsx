import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { SecretPhrase } from '@zeal/domains/KeyStore'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    keystore: SecretPhrase
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Modal>, { type: 'on_skip_verification_click' }>
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_continue_to_verificaiton_click'
                  | 'on_secret_phrase_reveal_back_clicked'
          }
      >

export const SecretPhraseReveal = ({
    keystore,
    sessionPassword,
    account,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                keystore={keystore}
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_skip_verification_confirmation_click':
                            setModal({ type: 'confirm_skip_verification' })
                            break

                        case 'on_continue_to_verificaiton_click':
                        case 'on_secret_phrase_reveal_back_clicked':
                            onMsg(msg)
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                account={account}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_skip_verification_click':
                            onMsg(msg)
                            break

                        case 'on_write_down_click':
                            setModal({ type: 'closed' })
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
