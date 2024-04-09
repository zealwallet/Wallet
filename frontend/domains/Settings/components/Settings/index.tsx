import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

type Props = {
    installationId: string
    mode: Mode
    manifest: Manifest
    connections: ConnectionMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Exclude<ModalMsg, { type: 'close' }>
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_lock_zeal_click'
                  | 'settings_add_new_account_click'
                  | 'track_wallet_clicked'
                  | 'on_open_fullscreen_view_click'
          }
      >

export const Settings = ({
    mode,
    installationId,
    manifest,
    onMsg,
    connections,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        postUserEvent({
            type: 'SettingsEnteredEvent',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Layout
                mode={mode}
                manifest={manifest}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_lock_zeal_click':
                        case 'settings_add_new_account_click':
                            onMsg(msg)
                            break
                        case 'on_open_fullscreen_view_click':
                            postUserEvent({
                                type: 'ExpandedViewEnteredEvent',
                                location: 'settings',
                                installationId,
                            })
                            onMsg(msg)
                            break
                        case 'on_manage_connections_click':
                            setState({ type: 'manage_connections' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                state={state}
                connections={connections}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break

                        case 'on_disconnect_dapps_click':
                        case 'on_delete_all_dapps_confirm_click':
                            setState({ type: 'closed' })
                            onMsg(msg)

                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
