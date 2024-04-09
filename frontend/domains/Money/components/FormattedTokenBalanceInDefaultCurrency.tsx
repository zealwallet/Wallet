import React from 'react'
import { useIntl } from 'react-intl'

import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { Money } from '@zeal/domains/Money'

type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const MAX_FRACTION_DIGITS = 2

export const FormattedTokenBalanceInDefaultCurrency = ({
    money,
    knownCurrencies,
}: Props) => {
    const { formatNumber } = useIntl()
    const currency = useCurrencyById(money.currencyId, knownCurrencies)

    if (!currency) {
        return null
    }
    const power = BigInt(10) ** BigInt(currency.fraction)

    // dollars are figural; represents how many full tokens
    const dollars = money.amount / power
    const smallAmount = Big(money.amount.toString())
        .div(Big(power.toString()))
        .toNumber()

    return money.amount <= 10n * power ? (
        <>
            {formatNumber(smallAmount, {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: MAX_FRACTION_DIGITS,
            })}
        </>
    ) : (
        <>
            {formatNumber(Number(dollars), {
                style: 'currency',
                currency: currency.code,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            })}
        </>
    )
}
