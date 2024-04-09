import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    initialSecretPhrase: string
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_user_cleared_secret_phrase' | 'close' }
      >
    | MsgOf<typeof Modal>

export const Form = ({
    initialSecretPhrase,
    sessionPassword,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                initialSecretPhrase={initialSecretPhrase}
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_user_cleared_secret_phrase':
                        case 'close':
                            onMsg(msg)
                            break

                        case 'on_encrypted_secret_phrase_submitted':
                            setModal({
                                type: 'success_modal',
                                encryptedPhrase: msg.encryptedPhrase,
                            })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal state={modal} onMsg={onMsg} />
        </>
    )
}
