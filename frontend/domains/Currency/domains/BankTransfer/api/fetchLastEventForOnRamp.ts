import { notReachable } from '@zeal/toolkit'

import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { ImperativeError } from '@zeal/domains/Error'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

export const fetchLastEventForOnRamp = async ({
    bankTransferInfo,
    bankTransferCurrencies,
    previousEvent,
    signal,
}: {
    previousEvent: OnRampTransactionEvent
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<OnRampTransactionEvent> => {
    const events = await fetchUnblockEvents({
        bankTransferCurrencies,
        bankTransferInfo,
        signal,
    })

    const eventsForSpecificOnRamp = events.filter(
        (event): event is OnRampTransactionEvent => {
            switch (event.type) {
                case 'kyc_event_status_changed':
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold_compliance':
                case 'unblock_offramp_on_hold_kyc':
                case 'unblock_offramp_failed':
                    return false
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_approved':
                case 'unblock_onramp_transfer_on_hold_compliance':
                case 'unblock_onramp_transfer_on_hold_kyc':
                case 'unblock_onramp_failed':
                    return (
                        event.transactionUuid === previousEvent.transactionUuid
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(event)
            }
        }
    )

    if (!eventsForSpecificOnRamp.length) {
        throw new ImperativeError(
            `No on-ramp events found for unblock transaction`,
            { transactionUuid: previousEvent.transactionUuid }
        )
    }

    const sortedByTime = eventsForSpecificOnRamp.sort(
        (a, b) => a.createdAt - b.createdAt
    )

    return sortedByTime[sortedByTime.length - 1]
}
