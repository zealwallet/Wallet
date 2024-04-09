import { notReachable } from '@zeal/toolkit'

import { ApprovalInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/ApprovalInfo'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export type State = { type: 'closed' } | { type: 'approval_info_popup' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'approval_info_popup':
            return <ApprovalInfo onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
