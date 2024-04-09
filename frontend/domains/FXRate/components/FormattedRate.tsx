import React from 'react'
import { useIntl } from 'react-intl'

import { Big } from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrenciesByRate } from '@zeal/domains/Currency/hooks/useCurrenciesByRate'
import { FXRate } from '@zeal/domains/FXRate'

const MIN_AMOUNT = new Big('0.1')
const MIN_SIGNIFICANT_NUMBER = 2

type Props = {
    rate: FXRate
    knownCurriencies: KnownCurrencies
}

export const FormattedRate = ({ knownCurriencies, rate }: Props) => {
    const { formatNumber } = useIntl()
    const { quote: currency } = useCurrenciesByRate(rate, knownCurriencies)

    const amount = new Big(rate.rate.toString()).div(
        Math.pow(10, currency.rateFraction)
    )

    const amountToFormat = amount.gte(MIN_AMOUNT)
        ? amount.toFixed(MIN_SIGNIFICANT_NUMBER, 0)
        : amount.toPrecision(MIN_SIGNIFICANT_NUMBER, 0)

    return (
        <>
            {formatNumber(parseFloat(amountToFormat), {
                style: 'currency',
                currency: currency.code,
                minimumFractionDigits: 2,
                maximumFractionDigits: currency.rateFraction,
            })}
        </>
    )
}
