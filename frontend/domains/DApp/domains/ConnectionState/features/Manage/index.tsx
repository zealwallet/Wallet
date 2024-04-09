import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Flow } from './Flow'

type Props = {
    installationId: string
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

type ForwardMsg = Extract<
    MsgOf<typeof Flow>,
    { type: 'on_disconnect_dapps_click' | 'on_delete_all_dapps_confirm_click' }
>

export type Msg = { type: 'close' } | ForwardMsg

type State = { type: 'flow' } | { type: 'success'; msg: ForwardMsg }

export const Manage = ({ connections, installationId, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'flow' })
    useEffect(() => {
        postUserEvent({
            type: 'ConnectionListEnteredEvent',
            installationId,
        })
    }, [installationId])

    switch (state.type) {
        case 'flow':
            return (
                <Flow
                    connections={connections}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_disconnect_dapps_click':
                                postUserEvent({
                                    type: 'AppDisconnectedEvent',
                                    location: 'settings',
                                    scope: 'single',
                                    installationId,
                                })
                                setState({ type: 'success', msg })
                                break
                            case 'on_delete_all_dapps_confirm_click':
                                postUserEvent({
                                    type: 'AppDisconnectedEvent',
                                    location: 'settings',
                                    scope: 'all',
                                    installationId,
                                })
                                setState({ type: 'success', msg })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'success':
            // TODO: Maybe the message should be different, taking plural\signular into account or something neutral
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="dapp.connection.manage.disconnect.success.title"
                            defaultMessage="Apps Disconnected"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg(state.msg)
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
