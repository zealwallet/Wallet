import { notReachable } from '@zeal/toolkit'

import { OffRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

type FetchParams = {
    transactionHash: string
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}

export const fetchLastOfframpEvent = async ({
    transactionHash,
    bankTransferInfo,
    bankTransferCurrencies,
    signal,
}: FetchParams): Promise<OffRampTransactionEvent | null> => {
    const events = await fetchUnblockEvents({
        bankTransferCurrencies,
        bankTransferInfo,
        signal,
    })

    const possibleEvents = events.filter(
        (event): event is OffRampTransactionEvent => {
            switch (event.type) {
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold_compliance':
                case 'unblock_offramp_on_hold_kyc':
                case 'unblock_offramp_failed':
                case 'unblock_offramp_pending':
                    return event.transactionHash === transactionHash
                case 'kyc_event_status_changed':
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_transfer_approved':
                case 'unblock_onramp_transfer_on_hold_compliance':
                case 'unblock_onramp_transfer_on_hold_kyc':
                case 'unblock_onramp_failed':
                case 'unblock_onramp_pending':
                    return false

                default:
                    return notReachable(event)
            }
        }
    )

    const sortedEvents = possibleEvents.sort(
        (a, b) => b.createdAt - a.createdAt
    )

    return sortedEvents[0] || null
}
