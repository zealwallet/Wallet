import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { Receive } from '@zeal/domains/Account/features/Receive'

type Props = {
    installationId: string
    state: State
    account: Account
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Receive>

export type State = { type: 'close' } | { type: 'receive_funds' }

export const Modal = ({ state, installationId, account, onMsg }: Props) => {
    switch (state.type) {
        case 'close':
            return null
        case 'receive_funds':
            return (
                <UIModal>
                    <Receive
                        installationId={installationId}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
