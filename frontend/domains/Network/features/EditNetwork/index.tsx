import React from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

export type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'on_select_rpc_click' }>
    | Extract<MsgOf<typeof Modal>, { type: 'on_rpc_change_confirmed' }>

export const EditNetwork = ({ network, networkRPCMap, onMsg }: Props) => {
    const [modalState, setModalState] = React.useState<ModalState>({
        type: 'closed',
    })

    return (
        <>
            <Layout
                network={network}
                networkRPCMap={networkRPCMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_select_rpc_click':
                            onMsg(msg)
                            break
                        case 'on_predefined_network_info_click':
                            setModalState({
                                type: 'predefined_network_info',
                            })
                            break
                        case 'on_add_custom_rpc_click':
                            setModalState({
                                type: 'add_network_rpc',
                            })
                            break
                        case 'on_edit_custom_rpc_click':
                            setModalState({
                                type: 'edit_network_rpc',
                                rpcUrl: msg.rpcUrl,
                            })
                            break
                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                network={network}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_rpc_change_confirmed':
                            onMsg(msg)
                            break
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
