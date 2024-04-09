import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { SimulatedTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    simulatedTransaction: SimulatedTransaction
    dAppInfo: DAppSiteInfo | null
}

export const SimulatedTransactionContentHeader = ({
    simulatedTransaction,
    dAppInfo,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                simulatedTransaction={simulatedTransaction}
                dAppInfo={dAppInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_approval_info_click':
                            setModal({ type: 'approval_info_popup' })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
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
