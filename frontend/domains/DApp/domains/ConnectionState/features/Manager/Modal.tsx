import { notReachable } from '@zeal/toolkit'

import { HowToConnectWithZeal } from '@zeal/domains/DApp/domains/ConnectionState/components/HowToConnectWithZeal'

type Props = {
    state: State
    installationId: string
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'how_to_connect_story' }

type Msg = { type: 'close' }

export const Modal = ({ state, installationId, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'how_to_connect_story':
            return (
                <HowToConnectWithZeal
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
