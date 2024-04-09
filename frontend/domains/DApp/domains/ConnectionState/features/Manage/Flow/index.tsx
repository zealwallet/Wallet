import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'on_disconnect_dapps_click' }>
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_delete_all_dapps_confirm_click' }
      >

export const Flow = ({ connections, onMsg }: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                connections={connections}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_disconnect_dapps_click':
                            onMsg(msg)
                            break
                        case 'on_disconnect_all_click':
                            setModalState({ type: 'confirm_delete_all' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_delete_all_dapps_confirm_click':
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
