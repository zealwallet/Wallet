import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { useCaptureErrorOnce } from '@zeal/domains/Error/hooks/useCaptureErrorOnce'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { SubmittedToBundlerUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { fetchSubmittedUserOperation } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation/api/fetchSubmittedUserOperation'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { Layout } from './Layout'

type Props = {
    userOperationRequest: SubmittedToBundlerUserOperationRequest
    simulation: SimulateTransactionResponse
    accountsMap: AccountsMap
    installationId: string
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | { type: 'on_safe_transaction_failure_accepted' }
    | MsgOf<typeof Layout>

const POLL_INTERVAL_MS = 1000

export const MonitorUserOperation = ({
    userOperationRequest,
    simulation,
    accountsMap,
    keyStoreMap,
    networkMap,
    installationId,
    visualState,
    actionSource,
    onMsg,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [pollable] = usePollableData(
        fetchSubmittedUserOperation,
        {
            type: 'loading',
            params: {
                submittedUserOperation:
                    userOperationRequest.submittedUserOperation,
                network: userOperationRequest.network,
            },
        },
        {
            pollIntervalMilliseconds: POLL_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded': {
                        switch (pollable.data.state) {
                            case 'pending':
                            case 'bundled':
                                return false
                            case 'completed':
                            case 'rejected':
                            case 'failed':
                                return true

                            default:
                                return notReachable(pollable.data)
                        }
                    }

                    case 'reloading':
                    case 'subsequent_failed':
                    case 'loading':
                    case 'error':
                        return false

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
            case 'reloading':
                break
            case 'loaded':
                switch (pollable.data.state) {
                    case 'pending':
                    case 'bundled':
                    case 'completed':
                        break
                    case 'failed':
                    case 'rejected':
                        captureErrorOnce(
                            new ImperativeError(
                                `User operation failed at bundler`,
                                {
                                    userOperationHash:
                                        pollable.params.submittedUserOperation
                                            .userOperationHash,
                                }
                            )
                        )
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable.data)
                }
                break
            case 'subsequent_failed':
            case 'error':
                captureErrorOnce(pollable.error)
                break

            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [onMsgLive, pollable, userOperationRequest, captureErrorOnce])

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed': {
            return (
                <Layout
                    installationId={installationId}
                    userOperationRequest={userOperationRequest}
                    submittedUserOperation={pollable.data}
                    simulation={simulation}
                    accounts={accountsMap}
                    keystores={keyStoreMap}
                    networkMap={networkMap}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )
        }

        case 'loading':
        case 'error':
            return (
                <Layout
                    installationId={installationId}
                    userOperationRequest={userOperationRequest}
                    submittedUserOperation={
                        pollable.params.submittedUserOperation
                    }
                    simulation={simulation}
                    accounts={accountsMap}
                    keystores={keyStoreMap}
                    networkMap={networkMap}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(pollable)
    }
}
