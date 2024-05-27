import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldDownload } from '@zeal/uikit/Icon/BoldDownload'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ProgressThin } from '@zeal/uikit/ProgressThin'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'
import { openExternalURL } from '@zeal/toolkit/Window'

import {
    CryptoCurrency,
    Currency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

type Props = {
    event: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
    networkMap: NetworkMap
}

const getFiatCurrency = (
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): FiatCurrency => {
    const currency: Currency | null = knownCurrencies[currencyId] || null

    if (!currency) {
        throw new ImperativeError(`Fiat currency with ID  not found`, {
            currencyId,
        })
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return currency
        case 'CryptoCurrency':
            throw new ImperativeError(
                `Expected fiat currency for ID, but got Cryptocurrency`,
                { currencyId: currency.id }
            )
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getCryptoCurrency = (
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): CryptoCurrency => {
    const currency = knownCurrencies[currencyId] || null

    if (!currency) {
        throw new ImperativeError(`Crypto currency with ID not found`, {
            currencyId,
        })
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                `Expected crypto currency for ID, but got FiatCurrency`,
                { currencyId: currency.id }
            )
        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const getProgress = (event: OnRampTransactionEvent): RangeInt<0, 100> => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_failed':
        case 'unblock_onramp_pending':
            return 20
        case 'unblock_onramp_transfer_approved':
            return 50
        case 'unblock_onramp_crypto_transfer_issued':
            return 70
        case 'unblock_onramp_process_completed':
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_transfer_on_hold_kyc':
            return 100
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const getProgressColour = (
    event: OnRampTransactionEvent
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_failed':
        case 'unblock_onramp_crypto_transfer_issued':
        case 'unblock_onramp_transfer_approved':
        case 'unblock_onramp_pending':
            return 'neutral'
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_transfer_on_hold_kyc':
            return 'warning'
        case 'unblock_onramp_process_completed':
            return 'success'
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

export const Layout = ({
    event,
    bankTransferCurrencies,
    networkMap,
}: Props) => {
    return (
        <Group variant="default">
            <Column spacing={12}>
                <Row spacing={12}>
                    <BoldDownload size={32} color="iconDefault" />
                    <Column spacing={4} shrink>
                        <Text
                            variant="callout"
                            weight="medium"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="bank-transfer.deposit.widget.title"
                                defaultMessage="Deposit"
                            />
                        </Text>

                        <Row spacing={8} alignX="stretch">
                            <Text
                                variant="footnote"
                                weight="regular"
                                color="textSecondary"
                            >
                                <Subtitle
                                    event={event}
                                    bankTransferCurrencies={
                                        bankTransferCurrencies
                                    }
                                />
                            </Text>

                            <Status
                                event={event}
                                networkMap={networkMap}
                                bankTransferCurrencies={bankTransferCurrencies}
                            />
                        </Row>
                    </Column>
                </Row>
                <Progress event={event} />
            </Column>
        </Group>
    )
}

const Subtitle = ({
    event,
    bankTransferCurrencies,
}: {
    event: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
}) => {
    const fiatCurrency = getFiatCurrency(
        event.fiat.currencyId,
        bankTransferCurrencies.knownCurrencies
    )
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_transfer_approved':
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_transfer_on_hold_kyc':
        case 'unblock_onramp_failed':
        case 'unblock_onramp_pending':
            return <>{fiatCurrency.code}</>
        case 'unblock_onramp_crypto_transfer_issued':
        case 'unblock_onramp_process_completed':
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            return (
                <FormattedMessage
                    id="bank-transfer.deposit.widget.subtitle"
                    defaultMessage="{from} to {to}"
                    values={{
                        from: fiatCurrency.code,
                        to: cryptoCurrency.code,
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Status = ({ event, bankTransferCurrencies, networkMap }: Props) => {
    switch (event.type) {
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_failed':
        case 'unblock_onramp_transfer_approved':
        case 'unblock_onramp_pending':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                >
                    <FormattedMessage
                        id="bank-transfer.deposit.widget.status.transfer-received"
                        defaultMessage="Funds received"
                    />
                </Text>
            )
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_transfer_on_hold_kyc':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusWarningOnColor"
                >
                    <FormattedMessage
                        id="bank-transfer.deposit.widget.status.transfer-on-hold"
                        defaultMessage="Transfer on hold"
                    />
                </Text>
            )
        case 'unblock_onramp_crypto_transfer_issued': {
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            const network = findNetworkByHexChainId(
                cryptoCurrency.networkHexChainId,
                networkMap
            )
            const explorerLink = getExplorerLink(
                { transactionHash: event.transactionHash },
                network
            )
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusNeutralOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.deposit.widget.status.transfer-received"
                            defaultMessage="Sending to wallet"
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
        }
        case 'unblock_onramp_process_completed': {
            const cryptoCurrency = getCryptoCurrency(
                event.crypto.currencyId,
                bankTransferCurrencies.knownCurrencies
            )
            const network = findNetworkByHexChainId(
                cryptoCurrency.networkHexChainId,
                networkMap
            )
            const explorerLink = getExplorerLink(
                { transactionHash: event.transactionHash },
                network
            )
            return (
                <Row spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textStatusSuccessOnColor"
                    >
                        <FormattedMessage
                            id="bank-transfer.deposit.widget.status.complete"
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
        }

        /* istanbul ignore next */
        default:
            return notReachable(event)
    }
}

const Progress = ({ event }: { event: OnRampTransactionEvent }) => {
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
