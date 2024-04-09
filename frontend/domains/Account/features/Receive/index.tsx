import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    account: Account
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Receive = ({ account, installationId, onMsg }: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                installationId={installationId}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break

                        case 'on_supported_networks_click':
                            setModal({ type: 'supported_networks_list' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
