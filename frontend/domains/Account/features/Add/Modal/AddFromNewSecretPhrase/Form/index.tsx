import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_user_cleared_secret_phrase' | 'close' }
      >
    | MsgOf<typeof Modal>

export const Form = ({ sessionPassword, onMsg }: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
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
