import React, { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import { getPredefinedNetworkMap } from '@zeal/domains/Network/helpers/getPredefinedNetworkMap'
import { useReloadableStorage } from '@zeal/domains/Storage/hooks/useReloadableStorage'

import { App } from './App'

type Props = {
    mode: Mode
    manifest: Manifest
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof App>

export const Main = ({ manifest, mode, onMsg }: Props) => {
    const [state] = useReloadableStorage({
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        switch (state.type) {
            case 'loading':
            case 'loaded':
            case 'reloading':
                break

            case 'subsequent_failed':
            case 'error':
                // TODO reset state
                captureError(
                    new ImperativeError(
                        'failed to load storage in extension Main'
                    )
                )
                break

            default:
                notReachable(state)
        }
    }, [state])

    switch (state.type) {
        case 'loading':
            return null // we don't show any loading state as it should take ms
        case 'reloading':
        case 'subsequent_failed':
        case 'loaded':
            return (
                <App
                    mode={mode}
                    networkMap={state.data.networkMap}
                    installationId={state.data.installationId}
                    manifest={manifest}
                    storage={state.data.storage}
                    sessionPassword={state.data.sessionPassword}
                    onMsg={onMsg}
                />
            )
        case 'error':
            // if we don't have storage most probably private browser
            return (
                <App
                    mode={mode}
                    networkMap={getPredefinedNetworkMap()}
                    installationId={uuid()}
                    manifest={manifest}
                    storage={null}
                    sessionPassword={null}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
