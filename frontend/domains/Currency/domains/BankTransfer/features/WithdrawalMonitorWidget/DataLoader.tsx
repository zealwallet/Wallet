import React, { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import {
    OffRampSuccessEvent,
    OffRampTransactionEvent,
    SubmittedOfframpTransaction,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { fetchBankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastOfframpEvent } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastOfframpEvent'
import { NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { LoadingLayout } from './LoadingLayout'

type Props = {
    submittedTransaction: SubmittedOfframpTransaction
    networkMap: NetworkMap
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_withdrawal_monitor_fiat_transaction_success'
    event: OffRampSuccessEvent
}

const POLLING_INTERVAL_MS = 5000

const fetch = async ({
    transactionHash,
    bankTransferInfo,
}: {
    transactionHash: string
    bankTransferInfo: BankTransferUnblockUserCreated
}): Promise<OffRampTransactionEvent | null> => {
    const bankTransferCurrencies = await fetchBankTransferCurrencies()

    return await fetchLastOfframpEvent({
        transactionHash,
        bankTransferInfo,
        bankTransferCurrencies,
    })
}

export const DataLoader = ({
    submittedTransaction,
    networkMap,
    onMsg,
    bankTransferInfo,
}: Props) => {
    const [pollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                transactionHash: submittedTransaction.transactionHash,
                bankTransferInfo,
            },
        },
        {
            pollIntervalMilliseconds: POLLING_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                        return false
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed': {
                        if (!pollable.data) {
                            return false
                        }
                        switch (pollable.data.type) {
                            case 'unblock_offramp_success':
                                return true
                            case 'unblock_offramp_in_progress':
                            case 'unblock_offramp_failed':
                            case 'unblock_offramp_on_hold_compliance':
                            case 'unblock_offramp_on_hold_kyc':
                            case 'unblock_offramp_fiat_transfer_issued':
                                return false
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data)
                        }
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
            case 'error':
                break
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed': {
                if (!pollable.data) {
                    break
                }
                switch (pollable.data.type) {
                    case 'unblock_offramp_success':
                        onMsgLive.current({
                            type: 'on_withdrawal_monitor_fiat_transaction_success',
                            event: pollable.data,
                        })
                        break

                    case 'unblock_offramp_in_progress':
                    case 'unblock_offramp_failed':
                    case 'unblock_offramp_on_hold_compliance':
                    case 'unblock_offramp_on_hold_kyc':
                    case 'unblock_offramp_fiat_transfer_issued':
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable.data)
                }
                break
            }
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [onMsgLive, pollable])

    switch (pollable.type) {
        case 'loading':
        case 'error':
            return <LoadingLayout submittedTransaction={submittedTransaction} />
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            if (!pollable.data) {
                return (
                    <LoadingLayout
                        submittedTransaction={submittedTransaction}
                    />
                )
            }
            return (
                <Layout
                    event={pollable.data}
                    submittedTransaction={submittedTransaction}
                    networkMap={networkMap}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
