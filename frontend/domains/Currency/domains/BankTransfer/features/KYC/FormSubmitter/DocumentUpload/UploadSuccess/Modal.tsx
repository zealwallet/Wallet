import { notReachable } from '@zeal/toolkit'

import { KycPendingModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPendingModal'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export type State = { type: 'closed' } | { type: 'kyc_pending_modal' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'kyc_pending_modal':
            return <KycPendingModal onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
