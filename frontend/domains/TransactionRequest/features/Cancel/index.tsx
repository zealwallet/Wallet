import { useEffect } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { ErrorPopup as LedgerErrorPopup } from '@zeal/domains/Error/domains/Ledger/components/ErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CancelSimulated, Submited } from '@zeal/domains/TransactionRequest'
import { cancel } from '@zeal/domains/TransactionRequest/api/cancel'
import { NonceTooLowPopup } from '@zeal/domains/TransactionRequest/components/NonceTooLowPopup'
import { cancelSubmittedToSubmitted } from '@zeal/domains/TransactionRequest/helpers/cancelSubmittedToSubmitted'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Confirmation } from './Confirmation'
import { Layout, State as LayoutState } from './Layout'

export type State = LayoutState

type Props = {
    transactionRequest: CancelSimulated
    keyStore: SigningKeyStore
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource
    state: State
    source: components['schemas']['TransactionEventSource']
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Layout>
    | MsgOf<typeof Confirmation>
    | { type: 'on_cancel_cancellation_click' }
    | { type: 'cancel_submitted'; transactionRequest: Submited }
    | Extract<MsgOf<typeof LedgerErrorPopup>, { type: 'on_ledger_error_close' }>

export const Cancel = ({
    transactionRequest,
    keyStore,
    sessionPassword,
    state,
    networkMap,
    networkRPCMap,
    source,
    installationId,
    actionSource,
    onMsg,
}: Props) => {
    const transactionRequestLive = useLiveRef(transactionRequest)
    const keystoreLive = useLiveRef(keyStore)

    const [loadable, setLoadable] = useLoadableData(cancel, {
        type: 'loading',
        params: {
            transactionRequest,
            keyStore,
            sessionPassword,
            networkMap,
            networkRPCMap,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                postUserEvent({
                    type: 'TransactionSubmittedEvent',
                    keystoreType: keystoreToUserEventType(keystoreLive.current),
                    installationId,
                    network: transactionRequestLive.current.networkHexId,
                    source,
                    keystoreId: keystoreLive.current.id,
                })
                onMsgLive.current({
                    type: 'cancel_submitted',
                    transactionRequest: cancelSubmittedToSubmitted(
                        loadable.data
                    ),
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [
        installationId,
        keystoreLive,
        loadable,
        onMsgLive,
        source,
        transactionRequestLive,
    ])

    switch (loadable.type) {
        case 'loading':
            return (
                <Layout
                    installationId={installationId}
                    networkMap={networkMap}
                    state={state}
                    transactionRequest={transactionRequest}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
            return (
                <Confirmation
                    installationId={installationId}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    state={state}
                    transactionRequest={loadable.data}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'error': {
            const error = parseAppError(loadable.error)
            return (
                <>
                    <Layout
                        installationId={installationId}
                        networkMap={networkMap}
                        state={state}
                        transactionRequest={transactionRequest}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />
                    {(() => {
                        switch (error.type) {
                            case 'hardware_wallet_failed_to_open_device':
                            case 'ledger_not_running_any_app':
                            case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
                            case 'ledger_running_non_eth_app':
                            case 'ledger_is_locked':
                                return (
                                    <LedgerErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_ledger_error_close':
                                                    onMsg(msg)
                                                    break
                                                case 'on_sync_ledger_click':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            case 'rpc_error_nounce_is_too_low':
                                return (
                                    <NonceTooLowPopup
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_close_nonce_too_low_modal':
                                                    onMsg({
                                                        type: 'on_cancel_cancellation_click',
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        msg.type
                                                    )
                                            }
                                        }}
                                    />
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={parseAppError(loadable.error)}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    onMsg({
                                                        type: 'on_cancel_cancellation_click',
                                                    })
                                                    break

                                                case 'try_again_clicked':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )
        }

        default:
            return notReachable(loadable)
    }
}
