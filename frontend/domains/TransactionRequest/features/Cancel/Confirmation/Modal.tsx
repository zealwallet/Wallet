import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CouldNotFindTransactionStatus } from '@zeal/domains/TransactionRequest/components/CouldNotFindTransactionStatus'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CouldNotFindTransactionStatus>

export type State =
    | { type: 'closed' }
    | { type: 'could_not_find_transaction_status' }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'could_not_find_transaction_status':
            return <CouldNotFindTransactionStatus onMsg={onMsg} />
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
