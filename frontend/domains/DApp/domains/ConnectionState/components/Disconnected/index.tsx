import React, { useLayoutEffect, useState } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'

import { HowToConnectWithZeal } from '@zeal/domains/DApp/domains/ConnectionState/components/HowToConnectWithZeal'
import {
    Minimized,
    Msg as MinimizedMsg,
} from '@zeal/domains/DApp/domains/ConnectionState/features/Minimized'

import { Disconnected as DisconnectedState } from '../..'

type Props = {
    installationId: string
    state: DisconnectedState
    isOnboardingStorySeen: boolean
    onMsg: (msg: Msg) => void
}

type State = { type: 'expanded' } | { type: 'minimized' }

export type Msg =
    | { type: 'disconnected_state_expanded' }
    | { type: 'disconnected_state_minimized' }
    | { type: 'connection_story_seen' }
    | Extract<MinimizedMsg, { type: 'drag' }>

export const Disconnected = ({
    state: connectionState,
    isOnboardingStorySeen,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        isOnboardingStorySeen ? { type: 'minimized' } : { type: 'expanded' }
    )
    const liveMsg = useLiveRef(onMsg)
    useLayoutEffect(() => {
        switch (state.type) {
            case 'expanded':
                liveMsg.current({ type: 'disconnected_state_expanded' })
                break
            case 'minimized':
                liveMsg.current({ type: 'disconnected_state_minimized' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [state, liveMsg])

    switch (state.type) {
        case 'expanded':
            return (
                <HowToConnectWithZeal
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'minimized' })
                                onMsg({ type: 'connection_story_seen' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'minimized':
            return (
                <Minimized
                    installationId={installationId}
                    state={connectionState}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                                setState({ type: 'expanded' })
                                break
                            case 'drag':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
