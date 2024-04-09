import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldId } from '@zeal/uikit/Icon/BoldId'
import { Row } from '@zeal/uikit/Row'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KYCStatusChangedEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { fetchBankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchUnblockEvents } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockEvents'
import { useCaptureErrorOnce } from '@zeal/domains/Error/hooks/useCaptureErrorOnce'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Status } from './Status'

type Props = {
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Status>

const fetch = async ({
    bankTransferInfo,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<KYCStatusChangedEvent | null> => {
    const bankTransferCurrencies = await fetchBankTransferCurrencies()

    const events = await fetchUnblockEvents({
        bankTransferInfo,
        bankTransferCurrencies,
    })

    const kycEvents = events
        .filter((event): event is KYCStatusChangedEvent => {
            switch (event.type) {
                case 'kyc_event_status_changed':
                    return true
                case 'unblock_offramp_in_progress':
                case 'unblock_offramp_fiat_transfer_issued':
                case 'unblock_offramp_success':
                case 'unblock_offramp_on_hold_compliance':
                case 'unblock_offramp_on_hold_kyc':
                case 'unblock_offramp_failed':
                case 'unblock_onramp_transfer_received':
                case 'unblock_onramp_crypto_transfer_issued':
                case 'unblock_onramp_process_completed':
                case 'unblock_onramp_transfer_in_review':
                case 'unblock_onramp_transfer_approved':
                case 'unblock_onramp_transfer_on_hold_compliance':
                case 'unblock_onramp_transfer_on_hold_kyc':
                case 'unblock_onramp_failed':
                    return false

                /* istanbul ignore next */
                default:
                    return notReachable(event)
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt)

    return kycEvents[0] || null
}

export const Flow = ({ bankTransferInfo, onMsg }: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [pollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                bankTransferInfo,
            },
        },
        {
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loaded':
                        if (!pollable.data) {
                            return false
                        }

                        switch (pollable.data.status.type) {
                            case 'not_started':
                            case 'in_progress':
                                return false

                            case 'approved':
                            case 'paused':
                            case 'failed':
                                return true

                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data.status)
                        }
                    case 'subsequent_failed':
                    case 'error':
                    case 'loading':
                    case 'reloading':
                        return false

                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'subsequent_failed':
            case 'error':
                captureErrorOnce(parseAppError(pollable.error))
                break

            case 'loaded':
            case 'reloading':
            case 'loading':
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable, captureErrorOnce])

    switch (pollable.type) {
        case 'error':
        case 'loading':
            return <Skeleton />

        case 'reloading':
        case 'subsequent_failed':
        case 'loaded':
            return pollable.data ? (
                <Status status={pollable.data.status} onMsg={onMsg} />
            ) : (
                <Skeleton />
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const Skeleton = () => {
    return (
        <Group variant="default">
            <Column spacing={12}>
                <Row spacing={12}>
                    <BoldId size={32} color="iconDefault" />
                    <Column spacing={4} shrink>
                        <Text
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank_transfer.kyc_status_widget.title"
                                defaultMessage="Verifying identity"
                            />
                        </Text>

                        <Row spacing={8} alignX="stretch">
                            <Text
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank_transfer.kyc_status_widget.subtitle"
                                    defaultMessage="Bank transfers"
                                />
                            </Text>

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Row>

                <UISkeleton variant="default" width="100%" height={8} />
            </Column>
        </Group>
    )
}
