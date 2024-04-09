import { notReachable } from '@zeal/toolkit'

import { Lending } from '@zeal/domains/App'

import { HealthRateInfoPopup } from './HealthRateInfoPopup'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export type State =
    | { type: 'closed' }
    | { type: 'health_rate_info'; protocol: Lending }

export const Modal = ({ state, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'health_rate_info':
            return (
                <HealthRateInfoPopup protocol={state.protocol} onMsg={onMsg} />
            )

        default:
            return notReachable(state)
    }
}
