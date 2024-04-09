import { useEffect, useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Submited } from '@zeal/domains/TransactionRequest'
import { SubmitedTransactionReplaced } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'

import { Layout, State as LayoutState } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    transactionRequest: Submited
    state: State
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Layout>
    | MsgOf<typeof Modal>
    | {
          type: 'transaction_request_replaced'
          transactionRequest: Submited
          submitedTransaction: SubmitedTransactionReplaced
      }

export type State = LayoutState

const POLL_INTERVAL_MS = 1000

export const CheckConfirmation = ({
    transactionRequest,
    state,
    accounts,
    keystores,
    networkMap,
    networkRPCMap,
    actionSource,
    onMsg,
    source,
    installationId,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    const [pollable] = usePollableData(
        fetchTransaction,
        {
            type: 'loading',
            params: {
                transaction: transactionRequest.submitedTransaction,
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

    const onMsgLive = useLiveRef(onMsg)

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
                        onMsgLive.current({
                            type: 'transaction_request_replaced',
                            transactionRequest,
                            submitedTransaction: pollable.data,
                        })
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
    }, [onMsgLive, pollable, transactionRequest])

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <>
                    <Layout
                        source={source}
                        installationId={installationId}
                        accounts={accounts}
                        keystores={keystores}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        state={state}
                        transactionRequest={{
                            ...transactionRequest,
                            submitedTransaction: pollable.data,
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
                        source={source}
                        installationId={installationId}
                        accounts={accounts}
                        keystores={keystores}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        state={state}
                        transactionRequest={{
                            ...transactionRequest,
                            submitedTransaction: pollable.params.transaction,
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
