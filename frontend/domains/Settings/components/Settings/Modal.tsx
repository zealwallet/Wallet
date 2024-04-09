import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { Manage as ManageConnections } from '@zeal/domains/DApp/domains/ConnectionState/features/Manage'

type Props = {
    installationId: string
    state: State
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof ManageConnections>

export type State = { type: 'closed' } | { type: 'manage_connections' }

export const Modal = ({ state, connections, installationId, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'manage_connections':
            return (
                <UIModal>
                    <ManageConnections
                        installationId={installationId}
                        connections={connections}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
