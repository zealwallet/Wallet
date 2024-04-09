import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    transaction: ApprovalTransaction
    originalEthSendTransaction: EthSendTransaction
    checks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    { type: 'on_edit_approval_form_submit' }
>

export const EditableApprove = ({
    transaction,
    onMsg,
    knownCurrencies,
    originalEthSendTransaction,
    network,
    networkRPCMap,
    checks,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                transaction={transaction}
                checks={checks}
                knownCurrencies={knownCurrencies}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_spend_limit_info_click':
                            setModal({ type: 'spend_limit_info' })
                            break
                        case 'on_edit_spend_limit_click':
                            setModal({ type: 'form' })
                            break
                        case 'on_spend_limit_warning_click':
                            setModal({ type: 'high_spend_limit_warning' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modal}
                originalEthSendTransaction={originalEthSendTransaction}
                transaction={transaction}
                network={network}
                networkRPCMap={networkRPCMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break
                        case 'on_edit_approval_form_submit':
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
