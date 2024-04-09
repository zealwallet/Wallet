import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import {
    KycNotStarted as KycNotStartedState,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    kycStatus: KycNotStartedState
    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    { type: 'on_kyc_start_verification_clicked' }
>

export const KycNotStarted = ({
    onMsg,
    network,
    offRampTransactionEvent,
    transactionHash,
    withdrawalRequest,
    kycStatus,
    networkMap,
    now,
    startedAt,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                kycStatus={kycStatus}
                networkMap={networkMap}
                offRampTransactionEvent={offRampTransactionEvent}
                withdrawalRequest={withdrawalRequest}
                network={network}
                transactionHash={transactionHash}
                now={now}
                startedAt={startedAt}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_verify_account_clicked':
                            setModal({ type: 'confirm_kyc_required_modal' })
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

                        case 'on_kyc_start_verification_clicked':
                            setModal({ type: 'closed' })
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
