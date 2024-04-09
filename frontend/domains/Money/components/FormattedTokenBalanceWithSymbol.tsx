import React from 'react'
import { useCallback } from 'react'
import { FormatNumberOptions, useIntl } from 'react-intl'

import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'

type Props = {
    money: Money
    knownCurrencies: KnownCurrencies
}

const LIMIT_FOR_FORMATTING = 1000
const NUMBER_OF_SIGNIFICANT_DIGITS = 4

/**
 * https://coda.io/d/_dL_vOIbEHfo/UI-Formatting_su1Fc#_luQUp
 */
export const useFormatTokenBalanceWithSymbol = () => {
    const { formatNumber } = useIntl()

    const format = useCallback(
        ({ knownCurrencies, money }: Props): string | null => {
            const currency = knownCurrencies[money.currencyId] || null // TODO how to make reporting for this?

            if (!currency) {
                return null
            }

            const power = BigInt(10) ** BigInt(currency.fraction)

            const dollars = money.amount / power
            const amount = new Big(money.amount.toString())
                .div(new Big(power.toString()))
                .toNumber()

            const options: FormatNumberOptions =
                dollars >= LIMIT_FOR_FORMATTING
                    ? {
                          maximumFractionDigits: 0,
                          signDisplay: 'never' as const,
                      }
                    : {
                          maximumSignificantDigits:
                              NUMBER_OF_SIGNIFICANT_DIGITS,
                          signDisplay: 'never' as const,
                      }

            return `${formatNumber(amount, options)} ${currency.symbol}`
        },
        [formatNumber]
    )

    return format
}

export const FormattedTokenBalanceWithSymbol = ({
    knownCurrencies,
    money,
}: Props) => {
    const format = useFormatTokenBalanceWithSymbol()

    return <>{format({ knownCurrencies, money })}</>
}
