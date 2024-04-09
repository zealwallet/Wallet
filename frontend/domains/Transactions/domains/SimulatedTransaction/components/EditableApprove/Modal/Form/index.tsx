import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    originalEthSendTransaction: EthSendTransaction
    transaction: ApprovalTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Layout>,
    {
        type: 'close' | 'on_edit_approval_form_submit'
    }
>

export const Form = ({
    originalEthSendTransaction,
    transaction,
    network,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                originalEthSendTransaction={originalEthSendTransaction}
                transaction={transaction}
                network={network}
                networkRPCMap={networkRPCMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_edit_approval_form_submit':
                            onMsg(msg)
                            break
                        case 'on_spend_limit_info_click':
                            setModal({ type: 'spend_limit_info' })
                            break
                        case 'on_high_spend_limit_warning_click':
                            setModal({ type: 'high_spend_limit_info' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
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
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
