import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    transaction: ApprovalTransaction
    checks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
}

export const Approve = ({ transaction, knownCurrencies, checks }: Props) => {
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
