import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { DragAndClickHandler } from '@zeal/uikit/DragAndClickHandler'
import { DisconnectedLogo } from '@zeal/uikit/Icon/DisconnectedLogo'
import { IconButton } from '@zeal/uikit/IconButton'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Disconnected } from '@zeal/domains/DApp/domains/ConnectionState'
import { ZWidgetToExtension } from '@zeal/domains/Main'
import { parseChromeRuntimeMessageRequestMsgs } from '@zeal/domains/Main/parsers/parseChromeRuntimeMessageRequestMsgs'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    state: Disconnected
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_expand_request' }
    | Extract<MsgOf<typeof DragAndClickHandler>, { type: 'drag' }>

export const Minimized = ({ onMsg, installationId }: Props) => {
    const { formatMessage } = useIntl()
    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        const messageListener = (
            request: unknown,
            sender: chrome.runtime.MessageSender,
            respond: (response: ZWidgetToExtension | undefined) => void
        ): true | undefined => {
            if (sender.id === chrome.runtime.id) {
                const messageResult =
                    parseChromeRuntimeMessageRequestMsgs(request)

                switch (messageResult.type) {
                    case 'Failure':
                        respond(undefined)
                        return undefined

                    case 'Success': {
                        switch (messageResult.data.type) {
                            case 'extension_to_zwidget_extension_address_change':
                            case 'extension_to_zwidget_query_zwidget_connection_state_and_network':
                            case 'to_service_worker_trezor_connect_get_public_key':
                            case 'to_service_worker_trezor_connect_sign_transaction':
                            case 'to_service_worker_trezor_connect_sign_message':
                            case 'to_service_worker_trezor_connect_sign_typed_data':
                                // not handled here
                                return true

                            case 'extension_to_zwidget_expand_zwidget':
                                respond(undefined)
                                postUserEvent({
                                    type: 'ZwidgetOpenedEvent',
                                    installationId,
                                    state: 'disconnected',
                                    location: 'dapp',
                                })
                                onMsgLive.current({ type: 'on_expand_request' })
                                return true

                            default:
                                return notReachable(messageResult.data)
                        }
                    }

                    default:
                        return notReachable(messageResult)
                }
            }

            return undefined
        }

        chrome.runtime.onMessage.addListener(messageListener)

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener)
        }
    }, [onMsgLive, installationId])

    return (
        <DragAndClickHandler
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_click':
                        postUserEvent({
                            type: 'ZwidgetOpenedEvent',
                            installationId,
                            state: 'disconnected',
                            location: 'extension',
                        })
                        onMsg({ type: 'on_expand_request' })
                        break
                    case 'drag':
                        onMsg(msg)
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg)
                }
            }}
        >
            <IconButton
                variant="on_light"
                aria-label={formatMessage({
                    id: 'zwidget.minimizedDisconnected.label',
                    defaultMessage: 'Zeal Disconnected',
                })}
                onClick={noop}
            >
                {({ color }) => <DisconnectedLogo size={36} />}
            </IconButton>
        </DragAndClickHandler>
    )
}
