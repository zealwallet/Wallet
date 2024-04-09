import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { CancelSubmited } from '@zeal/domains/TransactionRequest'
import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'

import { Layout, State as LayoutState } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    transactionRequest: CancelSubmited
    state: LayoutState
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Layout>
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_close_transaction_status_not_found_modal' }
      >

const POLL_INTERVAL_MS = 1000

export const Confirmation = ({
    transactionRequest,
    state,
    networkMap,
    networkRPCMap,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    const [pollable] = usePollableData(
        fetchTransaction,
        {
            type: 'loading',
            params: {
                transaction: transactionRequest.cancelSubmitedTransaction,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
                account: transactionRequest.account,
            },
        },
        {
            pollIntervalMilliseconds: POLL_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed': {
                        switch (pollable.data.state) {
                            case 'queued':
                            case 'included_in_block':
                                return false

                            case 'completed':
                            case 'failed':
                            case 'replaced':
                                return true

                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data)
                        }
                    }

                    case 'loading':
                    case 'error':
                        return false

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
                break
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                switch (pollable.data.state) {
                    case 'queued':
                    case 'included_in_block':
                    case 'completed':
                    case 'failed':
                        break
                    case 'replaced':
                        // No need to send msg since we do not store submitted cancel transactions
                        setModal({ type: 'could_not_find_transaction_status' })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable.data)
                }
                break
            case 'error':
                captureError(pollable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [pollable, transactionRequest])

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <>
                    <Layout
                        installationId={installationId}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        state={state}
                        transactionRequest={{
                            ...transactionRequest,
                            cancelSubmitedTransaction: pollable.data,
                        }}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />
                    <Modal state={modal} onMsg={onMsg} />
                </>
            )

        // If we yet don't have info render what we have initially
        case 'loading':
        case 'error':
            return (
                <>
                    <Layout
                        installationId={installationId}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        state={state}
                        transactionRequest={{
                            ...transactionRequest,
                            cancelSubmitedTransaction:
                                pollable.params.transaction,
                        }}
                        actionSource={actionSource}
                        onMsg={onMsg}
                    />
                    <Modal state={modal} onMsg={onMsg} />
                </>
            )

        default:
            return notReachable(pollable)
    }
}
