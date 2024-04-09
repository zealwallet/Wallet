import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KycRequiredModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycRequiredModal'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'confirm_kyc_required_modal' }

type Msg = MsgOf<typeof KycRequiredModal>

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_kyc_required_modal':
            return <KycRequiredModal onMsg={onMsg} />

        default:
            return notReachable(state)
    }
}
