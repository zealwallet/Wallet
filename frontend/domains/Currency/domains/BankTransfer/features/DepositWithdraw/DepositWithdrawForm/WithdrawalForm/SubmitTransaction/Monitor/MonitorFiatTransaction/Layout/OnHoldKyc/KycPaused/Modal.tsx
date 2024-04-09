import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KycPausedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPausedModal'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'confirm_kyc_paused_modal' }

type Msg = MsgOf<typeof KycPausedModal>

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_kyc_paused_modal':
            return <KycPausedModal onMsg={onMsg} />

        default:
            return notReachable(state)
    }
}
