import React from 'react'
import { useIntl } from 'react-intl'

import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FiatMoney, Money } from '@zeal/domains/Money'

type Props = {
    money: Money
    minimumFractionDigits: number
    knownCurrencies: KnownCurrencies
}

const MAX_FRACTION_DIGITS = 2

/**
 * @deprecated Use FormattedFiatCurrency2 instead
 */
export const FormattedFiatCurrency = ({
    knownCurrencies,
    money,
    minimumFractionDigits,
}: Props) => {
    const { formatNumber } = useIntl()
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    const power = BigInt(10) ** BigInt(currency.fraction)

    const amount = new Big(money.amount.toString())
        .div(new Big(power.toString()))
        .toNumber()

    return (
        <>
            {formatNumber(amount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
                minimumFractionDigits,
            })}
        </>
    )
}

export const FormattedFiatCurrency2 = ({
    money,
    minimumFractionDigits,
}: {
    money: FiatMoney
    minimumFractionDigits: number
}) => {
    const { formatNumber } = useIntl()
    const currency = money.currency

    const power = BigInt(10) ** BigInt(currency.fraction)

    const amount = new Big(money.amount.toString())
        .div(new Big(power.toString()))
        .toNumber()

    return (
        <>
            {formatNumber(amount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
                minimumFractionDigits,
            })}
        </>
    )
}
