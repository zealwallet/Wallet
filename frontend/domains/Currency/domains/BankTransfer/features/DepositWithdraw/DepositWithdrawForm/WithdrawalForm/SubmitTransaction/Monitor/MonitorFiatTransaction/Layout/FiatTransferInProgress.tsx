import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import {
    KycStatus,
    OffRampFailedEvent,
    OffRampFiatTransferIssuedEvent,
    OffRampInProgressEvent,
    OffRampOnHoldComplianceEvent,
    OffRampPendingEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OffRampTransactionView } from '@zeal/domains/Currency/domains/BankTransfer/components/OffRampTransactionView'
import {
    OFF_RAMP_SERVICE_TIME_MS,
    SUPPORT_SOFT_DEADLINE_MS,
} from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { OffRampProgress } from './OffRampProgress'

type Props = {
    networkMap: NetworkMap
    offRampTransactionEvent:
        | OffRampInProgressEvent
        | OffRampOnHoldComplianceEvent
        | OffRampFiatTransferIssuedEvent
        | OffRampFailedEvent
        | OffRampPendingEvent
        | null
    kycStatus: KycStatus
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_contact_support_clicked' }

export const FiatTransferInProgress = ({
    networkMap,
    now,
    onMsg,
    offRampTransactionEvent,
    startedAt,
    kycStatus,
    withdrawalRequest,
    network,
    transactionHash,
}: Props) => (
    <>
        <Content
            header={
                <Content.Header
                    title={
                        <FormattedMessage
                            id="currency.bankTransfer.withdrawal_status.title"
                            defaultMessage="Withdrawal"
                        />
                    }
                />
            }
            footer={
                <Footer
                    now={now}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    offRampTransactionEvent={offRampTransactionEvent}
                    network={network}
                    networkMap={networkMap}
                    withdrawalRequest={withdrawalRequest}
                    kycStatus={kycStatus}
                    onMsg={onMsg}
                />
            }
        >
            <OffRampTransactionView
                variant={{
                    type: 'status',
                    offRampTransactionEvent,
                    kycStatus,
                }}
                networkMap={networkMap}
                withdrawalRequest={withdrawalRequest}
            />
        </Content>

        <Actions>
            <Button size="regular" variant="secondary" disabled>
                <FormattedMessage
                    id="submitTransaction.stop"
                    defaultMessage="Stop"
                />
            </Button>

            <Button size="regular" variant="secondary" disabled>
                <FormattedMessage
                    id="submitTransaction.speedUp"
                    defaultMessage="Speed up"
                />
            </Button>
        </Actions>
    </>
)

type State = 'within_service_time' | 'over_service_time'

const calculateState = ({
    now,
    startedAt,
}: {
    now: number
    startedAt: number
}): State =>
    now - startedAt > OFF_RAMP_SERVICE_TIME_MS
        ? 'over_service_time'
        : 'within_service_time'

const Footer = ({
    onMsg,
    now,
    network,
    transactionHash,
    withdrawalRequest,
    offRampTransactionEvent,
    startedAt,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()
    const state = calculateState({ now, startedAt })

    switch (state) {
        case 'within_service_time':
            return (
                <OffRampProgress
                    network={network}
                    now={now}
                    offRampTransactionEvent={offRampTransactionEvent}
                    startedAt={startedAt}
                    transactionHash={transactionHash}
                    withdrawalRequest={withdrawalRequest}
                />
            )

        case 'over_service_time':
            return (
                <Column spacing={0}>
                    <OffRampProgress
                        network={network}
                        now={now}
                        offRampTransactionEvent={offRampTransactionEvent}
                        startedAt={startedAt}
                        transactionHash={transactionHash}
                        withdrawalRequest={withdrawalRequest}
                    />

                    <Divider variant="default" />

                    <BannerSolid
                        variant="neutral"
                        title={null}
                        subtitle={
                            <FormattedMessage
                                id="MonitorOffRamp.overServiceTime"
                                defaultMessage="Most transfers are completed within {estimated_time}, but sometimes they may take longer due to additional checks. This is normal and funds are safe while these checks are being made.{br}{br}If the transaction doesn’t complete within {support_soft_deadline}, please {contact_support}"
                                values={{
                                    br: '\n',
                                    estimated_time: formatHumanReadableDuration(
                                        OFF_RAMP_SERVICE_TIME_MS
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
