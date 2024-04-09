import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldUpload } from '@zeal/uikit/Icon/BoldUpload'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency, FiatCurrency } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'

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

export const LoadingLayout = ({
    submittedTransaction,
}: {
    submittedTransaction: SubmittedOfframpTransaction
}) => {
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
                                        from: cryptoCurrency.symbol,
                                        to: fiatCurrency.code,
                                    }}
                                />
                            </Text>

                            <Skeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Row>
                <Skeleton variant="default" width="100%" height={8} />
            </Column>
        </Group>
    )
}
