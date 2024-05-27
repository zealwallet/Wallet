import { ComponentProps } from 'react'
import { FormattedMessage } from 'react-intl'

import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'
import { openExternalURL } from '@zeal/toolkit/Window'

import {
    OffRampTransactionEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OFF_RAMP_SERVICE_TIME_MS } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Network } from '@zeal/domains/Network'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

type Props = {
    startedAt: number
    now: number
    network: Network
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
    transactionHash: string
}

export const OffRampProgress = ({
    now,
    offRampTransactionEvent,
    startedAt,
    withdrawalRequest,
    transactionHash,
    network,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    const rightSide = (
        <Row spacing={8}>
            <Text>
                {`${formatHumanReadableDuration(
                    now - startedAt,
                    'floor'
                )} / ${formatHumanReadableDuration(OFF_RAMP_SERVICE_TIME_MS)}`}
            </Text>

            <TransactionLink
                network={network}
                offRampTransactionEvent={offRampTransactionEvent}
                transactionHash={transactionHash}
            />
        </Row>
    )

    const title = (
        <Title
            offRampTransactionEvent={offRampTransactionEvent}
            withdrawalRequest={withdrawalRequest}
        />
    )

    if (!offRampTransactionEvent) {
        return (
            <Progress
                variant="neutral"
                title={title}
                right={rightSide}
                initialProgress={0}
                progress={30}
            />
        )
    }

    switch (offRampTransactionEvent.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
        case 'unblock_offramp_on_hold_compliance':
        case 'unblock_offramp_pending':
            return (
                <Progress
                    variant="neutral"
                    title={title}
                    right={rightSide}
                    initialProgress={30}
                    progress={60}
                />
            )

        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <Progress
                    variant="neutral"
                    title={title}
                    right={rightSide}
                    initialProgress={60}
                    progress={80}
                />
            )

        case 'unblock_offramp_success':
            return (
                <Progress
                    variant="success"
                    title={title}
                    right={
                        <TransactionLink
                            network={network}
                            offRampTransactionEvent={offRampTransactionEvent}
                            transactionHash={transactionHash}
                        />
                    }
                    initialProgress={80}
                    progress={100}
                />
            )
        case 'unblock_offramp_on_hold_kyc':
            return (
                <Progress
                    variant="warning"
                    title={title}
                    right={rightSide}
                    initialProgress={20}
                    progress={20}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(offRampTransactionEvent)
    }
}

const TransactionLink = ({
    transactionHash,
    network,
    offRampTransactionEvent,
}: {
    transactionHash: string
    network: Network
    offRampTransactionEvent: OffRampTransactionEvent | null
}) => {
    const link = getExplorerLink({ transactionHash }, network)

    const linkColor = ((): ComponentProps<typeof Tertiary>['color'] => {
        if (!offRampTransactionEvent) {
            return 'neutral'
        }

        switch (offRampTransactionEvent.type) {
            case 'unblock_offramp_in_progress':
            case 'unblock_offramp_failed':
            case 'unblock_offramp_fiat_transfer_issued':
            case 'unblock_offramp_on_hold_compliance':
            case 'unblock_offramp_pending':
                return 'neutral'

            case 'unblock_offramp_on_hold_kyc':
                return 'warning'

            case 'unblock_offramp_success':
                return 'success'

            default:
                return notReachable(offRampTransactionEvent)
        }
    })()

    return !link ? null : (
        <Tertiary
            size="regular"
            color={linkColor}
            onClick={() => openExternalURL(link)}
        >
            {({ color, textVariant, textWeight }) => (
                <Row spacing={4} alignY="center">
                    <Text
                        color={color}
                        variant={textVariant}
                        weight={textWeight}
                    >
                        0x
                    </Text>

                    <ExternalLink size={14} color={color} />
                </Row>
            )}
        </Tertiary>
    )
}

const Title = ({
    offRampTransactionEvent,
    withdrawalRequest,
}: {
    withdrawalRequest: WithdrawalRequest
    offRampTransactionEvent: OffRampTransactionEvent | null
}) => {
    const toCurrency = useCurrencyById(
        (() => {
            switch (withdrawalRequest.type) {
                case 'full_withdrawal_request':
                    return withdrawalRequest.toAmount.currencyId
                case 'incomplete_withdrawal_request':
                    return withdrawalRequest.currencyId
                default:
                    return notReachable(withdrawalRequest)
            }
        })(),
        withdrawalRequest.knownCurrencies
    )

    if (!offRampTransactionEvent) {
        return (
            <FormattedMessage
                id="currency.bankTransfer.off_ramp.transferring_to_currency"
                defaultMessage="Transferring to {toCurrency}"
                values={{ toCurrency: toCurrency?.code }}
            />
        )
    }

    switch (offRampTransactionEvent.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
        case 'unblock_offramp_on_hold_compliance':
        case 'unblock_offramp_pending':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.transferring_to_currency"
                    defaultMessage="Transferring to {toCurrency}"
                    values={{ toCurrency: toCurrency?.code }}
                />
            )

        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.fiat_transfer_issued"
                    defaultMessage="Sending to your bank"
                />
            )

        case 'unblock_offramp_success':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.complete"
                    defaultMessage="Complete"
                />
            )

        case 'unblock_offramp_on_hold_kyc':
            return (
                <FormattedMessage
                    id="currency.bankTransfer.off_ramp.transfer_on_hold"
                    defaultMessage="Transfer on hold"
                />
            )

        default:
            return notReachable(offRampTransactionEvent)
    }
}
