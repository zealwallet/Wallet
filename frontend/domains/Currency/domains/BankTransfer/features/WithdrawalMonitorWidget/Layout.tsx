import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldUpload } from '@zeal/uikit/Icon/BoldUpload'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ProgressThin } from '@zeal/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'
import { openExternalURL } from '@zeal/toolkit/Window'

import { CryptoCurrency, FiatCurrency } from '@zeal/domains/Currency'
import {
    OffRampTransactionEvent,
    SubmittedOfframpTransaction,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

type Props = {
    event: OffRampTransactionEvent
    submittedTransaction: SubmittedOfframpTransaction
    networkMap: NetworkMap
}

const getFiatCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): FiatCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currencyId = (() => {
        switch (withdrawalRequest.type) {
            case 'incomplete_withdrawal_request':
                return withdrawalRequest.currencyId
            case 'full_withdrawal_request':
                return withdrawalRequest.toAmount.currencyId
            /* istanbul ignore next */
            default:
                return notReachable(withdrawalRequest)
        }
    })()

    const currency = withdrawalRequest.knownCurrencies[currencyId] || null

    if (!currency) {
        throw new ImperativeError(`Fiat currency with ID ${currency} not found`)
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return currency
        case 'CryptoCurrency':
            throw new ImperativeError(
                `Expected fiat currency for ID ${currency}, but got Cryptocurrency`
            )
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getCryptoCurrency = (
    submittedTransaction: SubmittedOfframpTransaction
): CryptoCurrency => {
    const { withdrawalRequest } = submittedTransaction

    const currency =
        withdrawalRequest.knownCurrencies[
            withdrawalRequest.fromAmount.currencyId
        ] || null

    if (!currency) {
        throw new ImperativeError(
            `Crypto currency with ID ${currency} not found`
        )
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                `Expected crypto currency for ID ${currency}, but got FiatCurrency`
            )
        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getProgress = (event: OffRampTransactionEvent): RangeInt<0, 100> => {
    switch (event.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
            return 60
        case 'unblock_offramp_fiat_transfer_issued':
            return 80
        case 'unblock_offramp_on_hold_compliance':
        case 'unblock_offramp_on_hold_kyc':
        case 'unblock_offramp_success':
            return 100
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const getProgressColour = (
    event: OffRampTransactionEvent
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (event.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
        case 'unblock_offramp_fiat_transfer_issued':
            return 'neutral'
        case 'unblock_offramp_on_hold_compliance':
        case 'unblock_offramp_on_hold_kyc':
            return 'warning'
        case 'unblock_offramp_success':
            return 'success'

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

export const Layout = ({ event, submittedTransaction, networkMap }: Props) => {
    const cryptoCurrency = getCryptoCurrency(submittedTransaction)
    const fiatCurrency = getFiatCurrency(submittedTransaction)

    return (
        <Group variant="default">
            <Column spacing={12}>
                <Row spacing={12}>
                    <BoldUpload size={32} color="iconDefault" />
                    <Column spacing={4} shrink>
                        <Text
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank-transfer.withdrawal.widget.title"
                                defaultMessage="Withdrawal"
                            />
                        </Text>

                        <Row spacing={8} alignX="stretch">
                            <Text
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="bank-transfer.withdrawal.widget.subtitle"
                                    defaultMessage="{from} to {to}"
                                    values={{
                                        from: cryptoCurrency.code,
                                        to: fiatCurrency.code,
                                    }}
                                />
                            </Text>

                            <Status
                                event={event}
                                networkMap={networkMap}
                                cryptoCurrency={cryptoCurrency}
                            />
                        </Row>
                    </Column>
                </Row>
                <Progress event={event} />
            </Column>
        </Group>
    )
}

const Status = ({
    event,
    networkMap,
    cryptoCurrency,
}: {
    event: OffRampTransactionEvent
    networkMap: NetworkMap
    cryptoCurrency: CryptoCurrency
}) => {
    const explorerLink = getExplorerLink(
        {
            transactionHash: event.transactionHash,
        },
        findNetworkByHexChainId(cryptoCurrency.networkHexChainId, networkMap)
    )

    switch (event.type) {
        case 'unblock_offramp_in_progress':
        case 'unblock_offramp_failed':
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.in-progress"
                            defaultMessage="Making transfer"
                        />
                    </Text>

                    {!explorerLink ? null : (
                        <Tertiary
                            size="small"
                            color="neutral"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color, textVariant, textWeight }) => (
                                <Row spacing={0}>
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
                    )}
                </Row>
            )
        case 'unblock_offramp_fiat_transfer_issued':
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.fiat-transfer-issued"
                            defaultMessage="Sending to bank"
                        />
                    </Text>

                    {!explorerLink ? null : (
                        <Tertiary
                            size="small"
                            color="neutral"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color, textVariant, textWeight }) => (
                                <Row spacing={0}>
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
                    )}
                </Row>
            )
        case 'unblock_offramp_on_hold_compliance':
        case 'unblock_offramp_on_hold_kyc':
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusWarningOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.on-hold"
                            defaultMessage="Transfer on hold"
                        />
                    </Text>

                    {!explorerLink ? null : (
                        <Tertiary
                            size="small"
                            color="warning"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color, textVariant, textWeight }) => (
                                <Row spacing={0}>
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
                    )}
                </Row>
            )
        case 'unblock_offramp_success':
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusSuccessOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.withdrawal.widget.status.success"
                            defaultMessage="Complete"
                        />
                    </Text>

                    {!explorerLink ? null : (
                        <Tertiary
                            size="small"
                            color="success"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color, textVariant, textWeight }) => (
                                <Row spacing={0}>
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
                    )}
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Progress = ({ event }: { event: OffRampTransactionEvent }) => {
    const progress = getProgress(event)
    const colour = getProgressColour(event)

    return (
        <ProgressThin
            animationTimeMs={300}
            initialProgress={null}
            progress={progress}
            background={colour}
        />
    )
}
