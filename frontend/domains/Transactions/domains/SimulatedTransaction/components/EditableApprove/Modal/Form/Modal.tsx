import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { HighSpendLimitInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/HighSpendLimitInfo'

import { SpendLimitInfo } from '../../../SpendLimitInfo'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SpendLimitInfo>

export type State =
    | { type: 'closed' }
    | { type: 'spend_limit_info' }
    | { type: 'high_spend_limit_info' }

export const Modal = ({ onMsg, state }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'spend_limit_info':
            return <SpendLimitInfo onMsg={onMsg} />
        case 'high_spend_limit_info':
            return <HighSpendLimitInfo onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
