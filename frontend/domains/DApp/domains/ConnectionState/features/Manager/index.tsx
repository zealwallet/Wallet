import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { CurrentZWidgetConnectionStateAndNetwork } from '@zeal/domains/Main'
import { sendToActiveTabZWidget } from '@zeal/domains/Main/api/sendToActiveTabZWidget'
import { parseCurrentZWidgetConnectionStateAndNetwork } from '@zeal/domains/Main/parsers/parseZWidgetToExtensionMsgs'
import { NetworkMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_zwidget_expand_request' }

const fetch =
    async (): Promise<CurrentZWidgetConnectionStateAndNetwork | null> => {
        const response = await sendToActiveTabZWidget({
            type: 'extension_to_zwidget_query_zwidget_connection_state_and_network',
        })

        switch (response.type) {
            case 'zwidget_not_active':
                return null

            case 'message_sent_to_zwidget': {
                const parsed = parseCurrentZWidgetConnectionStateAndNetwork(
                    response.response
                )
                switch (parsed.type) {
                    case 'Success':
                        return parsed.data
                    case 'Failure':
                        return null

                    default:
                        return notReachable(parsed)
                }
            }

            default:
                return notReachable(response)
        }
    }

export const Manager = ({ networkMap, installationId, onMsg }: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    const [loadable] = useLoadableData(fetch, {
        type: 'loading',
        params: undefined,
    })

    return (
        <>
            <Layout
                installationId={installationId}
                loadable={loadable}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_connection_manager_clicked':
                            onMsg({ type: 'on_zwidget_expand_request' })
                            break

                        case 'on_inactive_zwidget_state_clicked':
                            setModal({ type: 'how_to_connect_story' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                installationId={installationId}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
