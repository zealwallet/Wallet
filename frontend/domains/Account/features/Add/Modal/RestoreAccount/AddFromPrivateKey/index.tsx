import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'

import { Form } from './Form'
import { Modal, State as ModalState } from './Modal'

type Props = {
    accounts: Account[]
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: KeyStore
          }[]
      }
    | MsgOf<typeof Modal>
    | Extract<MsgOf<typeof Form>, { type: 'on_secret_phrase_detected' }>

export const AddFromPrivateKey = ({
    sessionPassword,
    accounts,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Form
                accounts={accounts}
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_secret_phrase_detected':
                        case 'close':
                            onMsg(msg)
                            break

                        case 'on_private_key_submitted':
                            onMsg({
                                type: 'on_account_create_request',
                                accountsWithKeystores: [
                                    {
                                        account: msg.account,
                                        keystore: msg.keystore,
                                    },
                                ],
                            })
                            setModal({ type: 'success_modal' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal state={modal} onMsg={onMsg} />
        </>
    )
}
