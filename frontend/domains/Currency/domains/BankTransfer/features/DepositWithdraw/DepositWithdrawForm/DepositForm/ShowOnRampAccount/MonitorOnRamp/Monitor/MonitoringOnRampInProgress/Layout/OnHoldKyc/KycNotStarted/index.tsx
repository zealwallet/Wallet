import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    KycNotStarted as KycNotStartedState,
    OnRampTransactionOnHoldKycEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { NetworkMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    networkMap: NetworkMap
    event: OnRampTransactionOnHoldKycEvent
    kycStatus: KycNotStartedState
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    { type: 'on_kyc_start_verification_clicked' }
>

export const KycNotStarted = ({
    onMsg,
    event,
    form,
    knownCurrencies,
    networkMap,
    now,
    startedAt,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                event={event}
                form={form}
                knownCurrencies={knownCurrencies}
                networkMap={networkMap}
                now={now}
                startedAt={startedAt}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_verify_account_clicked':
                            setModal({ type: 'confirm_kyc_required_modal' })
                            break

                        default:
                            notReachable(msg.type)
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
