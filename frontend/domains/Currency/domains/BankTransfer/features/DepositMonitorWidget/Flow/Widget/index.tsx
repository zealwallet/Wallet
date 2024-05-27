import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastEventForOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastEventForOnRamp'
import { NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Layout } from './Layout'

type Props = {
    event: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
    networkMap: NetworkMap
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_onramp_success' }

const POLLING_INTERVAL_MS = 5000

export const Widget = ({
    event,
    bankTransferCurrencies,
    networkMap,
    bankTransferInfo,
    onMsg,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchLastEventForOnRamp,
        {
            type: 'loading',
            params: {
                previousEvent: event,
                bankTransferInfo,
                bankTransferCurrencies,
            },
        },
        {
            pollIntervalMilliseconds: POLLING_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                    case 'reloading':
                    case 'subsequent_failed':
                        return false
                    case 'loaded': {
                        switch (pollable.data.type) {
                            case 'unblock_onramp_transfer_received':
                            case 'unblock_onramp_transfer_in_review':
                            case 'unblock_onramp_crypto_transfer_issued':
                            case 'unblock_onramp_transfer_approved':
                            case 'unblock_onramp_transfer_on_hold_compliance':
                            case 'unblock_onramp_transfer_on_hold_kyc':
                            case 'unblock_onramp_failed':
                            case 'unblock_onramp_pending':
                                return false
                            case 'unblock_onramp_process_completed':
                                return true
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

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
            case 'error':
                break
            // We wait for data
            case 'reloading':
            case 'subsequent_failed':
            case 'loaded': {
                switch (pollable.data.type) {
                    case 'unblock_onramp_transfer_received':
                    case 'unblock_onramp_transfer_in_review':
                    case 'unblock_onramp_crypto_transfer_issued':
                    case 'unblock_onramp_transfer_approved':
                    case 'unblock_onramp_transfer_on_hold_compliance':
                    case 'unblock_onramp_transfer_on_hold_kyc':
                    case 'unblock_onramp_failed':
                    case 'unblock_onramp_pending':
                        // We wait for success event
                        break
                    case 'unblock_onramp_process_completed':
                        liveMsg.current({ type: 'on_onramp_success' })
                        break

                    /* istanbul ignore next */
                    default:
                        notReachable(pollable.data)
                }
                break
            }
            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable, liveMsg])

    switch (pollable.type) {
        case 'loading':
        case 'error':
            return (
                <Layout
                    event={pollable.params.previousEvent}
                    networkMap={networkMap}
                    bankTransferCurrencies={bankTransferCurrencies}
                />
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    event={pollable.data}
                    networkMap={networkMap}
                    bankTransferCurrencies={bankTransferCurrencies}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
