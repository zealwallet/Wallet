import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const fetchLastUnfinishedOnRamp = async ({
    bankTransferInfo,
    bankTransferCurrencies,
    signal,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OnRampTransactionEvent | null> => {
    const events = await fetchUnblockEvents({
        bankTransferCurrencies,
        bankTransferInfo,
        signal,
    })

    const onRampEvents = events.filter(
        (event): event is OnRampTransactionEvent => {
            switch (event.type) {
                case 'kyc_event_status_changed':
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold_compliance':
                case 'unblock_offramp_on_hold_kyc':
                case 'unblock_offramp_failed':
                case 'unblock_offramp_pending':
                    return false
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_approved':
                case 'unblock_onramp_transfer_on_hold_compliance':
                case 'unblock_onramp_transfer_on_hold_kyc':
                case 'unblock_onramp_failed':
                case 'unblock_onramp_pending':
                    return true
                default:
                    return notReachable(event)
            }
        }
    )

    const onRamps: Record<string, OnRampTransactionEvent[]> =
        onRampEvents.reduce((hash, event) => {
            if (hash[event.transactionUuid]) {
                hash[event.transactionUuid].push(event)
            } else {
                hash[event.transactionUuid] = [event]
            }
            return hash
        }, {} as Record<string, OnRampTransactionEvent[]>)

    const unfinishedOnRamps = values(onRamps)
        .filter((events) => events.length)
        .filter(
            (events) =>
                !events.some((event) => {
                    switch (event.type) {
                        case 'unblock_onramp_transfer_received':
                        case 'unblock_onramp_transfer_in_review':
                        case 'unblock_onramp_transfer_approved':
                        case 'unblock_onramp_crypto_transfer_issued':
                        case 'unblock_onramp_transfer_on_hold_compliance':
                        case 'unblock_onramp_transfer_on_hold_kyc':
                        case 'unblock_onramp_failed':
                        case 'unblock_onramp_pending':
                            return false
                        case 'unblock_onramp_process_completed':
                            return true
                        default:
                            return notReachable(event)
                    }
                })
        )

    if (!unfinishedOnRamps.length) {
        return null
    }

    const earliestEventTimestampHash: Record<string, number> =
        unfinishedOnRamps.reduce((hash, unfinishedOnRamp) => {
            hash[unfinishedOnRamp[0].transactionUuid] = unfinishedOnRamp.reduce(
                (min, event) => (event.createdAt < min ? event.createdAt : min),
                Number.POSITIVE_INFINITY
            )
            return hash
        }, {} as Record<string, number>)

    const sortedUnfinishedOnRamps = [...unfinishedOnRamps].sort(
        (a, b) =>
            earliestEventTimestampHash[a[0].transactionUuid] -
            earliestEventTimestampHash[b[0].transactionUuid]
    )

    const lastUnfinishedOnRamp =
        sortedUnfinishedOnRamps[sortedUnfinishedOnRamps.length - 1]

    const sortedEvents = lastUnfinishedOnRamp.sort(
        (a, b) => a.createdAt - b.createdAt
    )

    return sortedEvents[sortedEvents.length - 1]
}
