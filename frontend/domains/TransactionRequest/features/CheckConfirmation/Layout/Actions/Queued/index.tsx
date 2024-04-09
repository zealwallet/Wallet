import { useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'

import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    ModalMsg,
    { type: 'confirm_speed_up_click' | 'cancellation_confirmed' }
>

export const AddedToQueue = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
    keyStore,
    source,
    installationId,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'stop_clicked':
                            setModalState({ type: 'cancel_transaction' })
                            break

                        case 'speed_up_clicked':
                            setModalState({ type: 'speedup_transaction' })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                source={source}
                keyStore={keyStore}
                installationId={installationId}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                transactionRequest={transactionRequest}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'confirm_speed_up_click':
                        case 'cancellation_confirmed':
                            onMsg(msg)
                            break

                        case 'close':
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
