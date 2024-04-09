import { useEffect, useState } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    KycStatus,
    OffRampSuccessEvent,
    OffRampTransactionEvent,
    SubmittedOfframpTransaction,
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastOfframpEvent } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastOfframpEvent'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { useCaptureErrorOnce } from '@zeal/domains/Error/hooks/useCaptureErrorOnce'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Layout } from './Layout'

type Props = {
    network: Network
    networkMap: NetworkMap
    account: Account
    keyStoreMap: KeyStoreMap
    transactionHash: string
    withdrawalRequest: WithdrawalRequest
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof Layout>
    | {
          type: 'on_withdrawal_monitor_fiat_transaction_start'
          submittedTransaction: SubmittedOfframpTransaction
      }
    | {
          type: 'on_withdrawal_monitor_fiat_transaction_success'
          event: OffRampSuccessEvent
      }

const fetch = async ({
    transactionHash,
    bankTransferInfo,
    bankTransferCurrencies,
    signal,
}: {
    transactionHash: string
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<{
    transactionEvent: OffRampTransactionEvent | null
    kycStatus: KycStatus
}> => {
    const [user, transactionEvent] = await Promise.all([
        fetchUser({
            bankTransferInfo,
            signal,
        }),
        fetchLastOfframpEvent({
            bankTransferCurrencies,
            bankTransferInfo,
            transactionHash,
        }),
    ])

    return {
        kycStatus: user.kycStatus,
        transactionEvent,
    }
}

export const MonitorFiatTransaction = ({
    transactionHash,
    bankTransferInfo,
    onMsg,
    account,
    keyStoreMap,
    network,
    networkMap,
    withdrawalRequest,
    bankTransferCurrencies,
    unblockUser,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [startedAt] = useState<number>(Date.now())
    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const [pollable, setPollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                transactionHash,
                bankTransferInfo,
                bankTransferCurrencies,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        liveMsg.current({
            type: 'on_withdrawal_monitor_fiat_transaction_start',
            submittedTransaction: {
                transactionHash,
                withdrawalRequest,
            },
        })
    }, [liveMsg, transactionHash, withdrawalRequest])

    useEffect(() => {
        switch (pollable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed': {
                if (pollable.data.transactionEvent) {
                    switch (pollable.data.transactionEvent.type) {
                        case 'unblock_offramp_in_progress':
                        case 'unblock_offramp_failed':
                        case 'unblock_offramp_fiat_transfer_issued':
                        case 'unblock_offramp_on_hold_compliance':
                        case 'unblock_offramp_on_hold_kyc':
                            break

                        case 'unblock_offramp_success':
                            liveMsg.current({
                                type: 'on_withdrawal_monitor_fiat_transaction_success',
                                event: pollable.data.transactionEvent,
                            })
                            break

                        default:
                            notReachable(pollable.data.transactionEvent)
                    }
                }
                break
            }

            case 'loading':
                break

            case 'error':
                captureErrorOnce(pollable.error)
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [liveMsg, pollable, captureErrorOnce])

    switch (pollable.type) {
        case 'loading':
            return (
                <Layout
                    now={now}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    offRampTransactionEvent={null}
                    kycStatus={unblockUser.kycStatus}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    withdrawalRequest={withdrawalRequest}
                />
            )

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    now={now}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    offRampTransactionEvent={pollable.data.transactionEvent}
                    kycStatus={pollable.data.kycStatus}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    withdrawalRequest={withdrawalRequest}
                />
            )

        case 'error':
            return (
                <>
                    <Layout
                        now={now}
                        startedAt={startedAt}
                        transactionHash={transactionHash}
                        offRampTransactionEvent={null}
                        kycStatus={unblockUser.kycStatus}
                        account={account}
                        keyStoreMap={keyStoreMap}
                        network={network}
                        networkMap={networkMap}
                        onMsg={onMsg}
                        withdrawalRequest={withdrawalRequest}
                    />

                    <AppErrorPopup
                        error={parseAppError(pollable.error)}
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
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
