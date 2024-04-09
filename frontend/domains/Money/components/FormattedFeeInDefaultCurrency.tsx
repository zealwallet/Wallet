import React from 'react'
import { useIntl } from 'react-intl'

import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FiatMoney, Money } from '@zeal/domains/Money'

export type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const MAX_FRACTION_DIGITS = 2

/**
 * TODO @resetko-zeal remove this
 * @deprecated use FormattedFeeInDefaultCurrency2 instead if you can
 */
export const FormattedFeeInDefaultCurrency = ({
    knownCurrencies,
    money,
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
            {formatNumber(amount < 0.01 ? 0.01 : amount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
            })}
        </>
    )
}

export const FormattedFeeInDefaultCurrency2 = ({
    money,
}: {
    money: FiatMoney
}) => {
    const { formatNumber } = useIntl()
    const currency = money.currency

    const power = BigInt(10) ** BigInt(currency.fraction)

    const amount = new Big(money.amount.toString())
        .div(new Big(power.toString()))
        .toNumber()

    return (
        <>
            {formatNumber(amount < 0.01 ? 0.01 : amount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
            })}
        </>
    )
}
