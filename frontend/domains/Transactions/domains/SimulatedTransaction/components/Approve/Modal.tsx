import { notReachable } from '@zeal/toolkit'

import { HighSpendLimitInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/HighSpendLimitInfo'
import { SpendLimitInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SpendLimitInfo'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export type State =
    | { type: 'closed' }
    | { type: 'spend_limit_info' }
    | { type: 'high_spend_limit_warning' }

export const Modal = ({ onMsg, state }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'spend_limit_info':
            return <SpendLimitInfo onMsg={onMsg} />
        case 'high_spend_limit_warning':
            return <HighSpendLimitInfo onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
