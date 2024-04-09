import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { Account } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { useCaptureErrorOnce } from '@zeal/domains/Error/hooks/useCaptureErrorOnce'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SubmittedUserOperation } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { fetchSubmittedUserOperation } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation/api/fetchSubmittedUserOperation'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    submittedUserOperation: SubmittedUserOperation
    keyStore: Safe4337
    label: string
    network: Network
    onMsg: (msg: Msg) => void
}

const STATUS_CHECK_INTERVAL_MS = 1000

type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: Safe4337
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: Safe4337
          }[]
      }

export const CheckUserOperationStatus = ({
    submittedUserOperation,
    network,
    keyStore,
    onMsg,
    label,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()

    const [pollable, setPollable] = usePollableData(
        fetchSubmittedUserOperation,
        {
            type: 'loading',
            params: {
                submittedUserOperation,
                network,
            },
        },
        {
            pollIntervalMilliseconds: STATUS_CHECK_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                        return false
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        switch (pollable.data.state) {
                            case 'pending':
                            case 'bundled':
                                return false
                            case 'completed':
                            case 'rejected':
                            case 'failed':
                                return true
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data)
                        }
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
                    case 'pending':
                    case 'bundled':
                    case 'rejected':
                    case 'failed':
                        break
                    case 'completed':
                        onMsgLive.current({
                            type: 'on_account_create_request',
                            accountsWithKeystores: [
                                {
                                    account: {
                                        address: submittedUserOperation.sender,
                                        label,
                                        avatarSrc: null,
                                    },
                                    keystore: keyStore,
                                },
                            ],
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable.data)
                }
                break
            case 'error':
                captureErrorOnce(pollable.error)
                break

            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [
        label,
        onMsgLive,
        pollable,
        keyStore,
        submittedUserOperation.sender,
        captureErrorOnce,
    ])

    switch (pollable.type) {
        case 'loaded': {
            switch (pollable.data.state) {
                case 'pending':
                case 'bundled':
                    return <LoadingLayout onMsg={onMsg} />
                case 'rejected':
                case 'failed':
                    const error = new ImperativeError(
                        'User operation to deploy reference safe failed'
                    )
                    return (
                        <>
                            <LoadingLayout onMsg={onMsg} />
                            <AppErrorPopup
                                error={error}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg(msg)
                                            break
                                        case 'try_again_clicked':
                                            setPollable({
                                                type: 'loading',
                                                params: pollable.params,
                                            })
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg)
                                    }
                                }}
                            />
                        </>
                    )

                case 'completed':
                    return (
                        <SuccessLayout
                            title={
                                <FormattedMessage
                                    id="safe-creation.success.title"
                                    defaultMessage="Wallet created"
                                />
                            }
                            onAnimationComplete={() =>
                                onMsg({
                                    type: 'on_accounts_create_success_animation_finished',
                                    accountsWithKeystores: [
                                        {
                                            account: {
                                                address:
                                                    submittedUserOperation.sender,
                                                label,
                                                avatarSrc: null,
                                            },
                                            keystore: keyStore,
                                        },
                                    ],
                                })
                            }
                        />
                    )
                default:
                    return notReachable(pollable.data)
            }
        }
        case 'reloading':
        case 'subsequent_failed':
        case 'loading':
        case 'error':
            return <LoadingLayout onMsg={onMsg} />

        default:
            return notReachable(pollable)
    }
}
