import { FormattedMessage } from 'react-intl'

import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Progress } from '@zeal/uikit/Progress'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import {
    OnRampTransactionCryptoTransferIssuedEvent,
    OnRampTransactionFailedEvent,
    OnRampTransactionOnHoldComplianceEvent,
    OnRampTransactionOutsideTransferInReviewEvent,
    OnRampTransactionPendingEvent,
    OnRampTransactionTransferApprovedEvent,
    OnRampTransactionTransferReceivedEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import {
    ON_RAMP_SERVICE_TIME_MS,
    SUPPORT_SOFT_DEADLINE_MS,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'

import { OnRampProgressTime } from '../OnRampProgressTime'

type Props = {
    event:
        | OnRampTransactionFailedEvent
        | OnRampTransactionOnHoldComplianceEvent
        | OnRampTransactionOutsideTransferInReviewEvent
        | OnRampTransactionTransferApprovedEvent
        | OnRampTransactionTransferReceivedEvent
        | OnRampTransactionCryptoTransferIssuedEvent
        | OnRampTransactionPendingEvent
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type State = 'within_service_time' | 'over_service_time'

type Msg = { type: 'on_contact_support_clicked' }

const calculateState = ({
    now,
    startedAt,
}: {
    now: number
    startedAt: number
}): State =>
    now - startedAt > ON_RAMP_SERVICE_TIME_MS
        ? 'over_service_time'
        : 'within_service_time'

export const Footer = ({ event, now, startedAt, onMsg }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()
    const state = calculateState({ now, startedAt })

    switch (state) {
        case 'within_service_time':
            return (
                <Column spacing={0}>
                    <TransactionProgress
                        event={event}
                        now={now}
                        startedAt={startedAt}
                    />
                </Column>
            )

        case 'over_service_time':
            return (
                <Column spacing={0}>
                    <TransactionProgress
                        event={event}
                        now={now}
                        startedAt={startedAt}
                    />

                    <Divider variant="default" />

                    <BannerSolid
                        variant="neutral"
                        title={null}
                        subtitle={
                            <FormattedMessage
                                id="MonitorOnRamp.overServiceTime"
                                defaultMessage="Most transfers are completed within {estimated_time}, but sometimes they may take longer due to additional checks. This is normal and funds are safe while these checks are being made.{br}{br}If the transaction doesn’t complete within {support_soft_deadline}, please {contact_support}"
                                values={{
                                    br: '\n',
                                    estimated_time: formatHumanReadableDuration(
                                        ON_RAMP_SERVICE_TIME_MS
                                    ),
                                    support_soft_deadline:
                                        formatHumanReadableDuration(
                                            SUPPORT_SOFT_DEADLINE_MS - 1,
                                            'ceil',
                                            'long'
                                        ),
                                    contact_support: (
                                        <Tertiary
                                            color="neutral"
                                            size="regular"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_contact_support_clicked',
                                                })
                                            }
                                        >
                                            {({
                                                color,
                                                textVariant,
                                                textWeight,
                                            }) => (
                                                <Text
                                                    color={color}
                                                    weight={textWeight}
                                                    variant={textVariant}
                                                >
                                                    <FormattedMessage
                                                        id="MonitorOnRamp.contactSupport"
                                                        defaultMessage="Contact support"
                                                    />
                                                </Text>
                                            )}
                                        </Tertiary>
                                    ),
                                }}
                            />
                        }
                    />
                </Column>
            )

        default:
            return notReachable(state)
    }
}

const TransactionProgress = ({
    event,
    now,
    startedAt,
}: {
    event:
        | OnRampTransactionFailedEvent
        | OnRampTransactionOnHoldComplianceEvent
        | OnRampTransactionOutsideTransferInReviewEvent
        | OnRampTransactionTransferApprovedEvent
        | OnRampTransactionTransferReceivedEvent
        | OnRampTransactionCryptoTransferIssuedEvent
        | OnRampTransactionPendingEvent
    now: number
    startedAt: number
}) => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_failed':
        case 'unblock_onramp_transfer_approved':
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_pending':
            return (
                <Progress
                    variant="neutral"
                    initialProgress={10}
                    progress={20}
                    title={
                        <FormattedMessage
                            id="MonitorOnRamp.fundsReceived"
                            defaultMessage="Funds received"
                        />
                    }
                    right={
                        <OnRampProgressTime now={now} startedAt={startedAt} />
                    }
                />
            )

        case 'unblock_onramp_crypto_transfer_issued':
            return (
                <Progress
                    variant="neutral"
                    initialProgress={20}
                    progress={70}
                    title={
                        <FormattedMessage
                            id="MonitorOnRamp.sendingToYourWallet"
                            defaultMessage="Sending to your wallet"
                        />
                    }
                    right={
                        <OnRampProgressTime now={now} startedAt={startedAt} />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}
