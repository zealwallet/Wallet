import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KycStatus } from '@zeal/domains/Currency/domains/BankTransfer'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

export type Props = {
    status: KycStatus
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'on_dismiss_kyc_button_clicked' }>
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_kyc_try_again_clicked' | 'on_do_bank_transfer_clicked' }
      >

export const Status = ({ status, onMsg }: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                status={status}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_dismiss_kyc_button_clicked':
                            onMsg(msg)
                            break

                        case 'on_click':
                            setModalState({ type: 'kyc_status_modal' })
                            break

                        default:
                            return notReachable(msg)
                    }
                }}
            />

            <Modal
                state={modalState}
                kycStatus={status}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_kyc_try_again_clicked':
                        case 'on_do_bank_transfer_clicked':
                            onMsg(msg)
                            break

                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
