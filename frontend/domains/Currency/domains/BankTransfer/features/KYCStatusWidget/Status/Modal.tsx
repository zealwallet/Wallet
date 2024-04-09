import { notReachable } from '@zeal/toolkit'

import { KycStatus } from '@zeal/domains/Currency/domains/BankTransfer'
import { KycApprovedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycApprovedModal'
import { KycFailedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycFailedModal'
import { KycPausedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPausedModal'
import { KycPendingModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPendingModal'

export type Props = {
    state: State
    kycStatus: KycStatus
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_kyc_try_again_clicked' }
    | { type: 'on_do_bank_transfer_clicked' }

export type State = { type: 'closed' } | { type: 'kyc_status_modal' }

export const Modal = ({ state, kycStatus, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'kyc_status_modal':
            switch (kycStatus.type) {
                case 'not_started':
                case 'in_progress':
                    return <KycPendingModal onMsg={onMsg} />

                case 'paused':
                    return <KycPausedModal onMsg={onMsg} />

                case 'failed':
                    return <KycFailedModal onMsg={onMsg} />

                case 'approved':
                    return <KycApprovedModal onMsg={onMsg} />

                default:
                    return notReachable(kycStatus)
            }

        default:
            return notReachable(state)
    }
}
