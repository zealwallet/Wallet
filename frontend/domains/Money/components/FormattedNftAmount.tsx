import React from 'react'
import { useCallback } from 'react'
import { FormatNumberOptions, useIntl } from 'react-intl'

import Big from 'big.js'

import { Nft } from '@zeal/domains/NFTCollection'

type Props = {
    nft: Nft
    transferAmount: bigint
}

const LIMIT_FOR_FORMATTING = 1000
const NUMBER_OF_SIGNIFICANT_DIGITS = 4

/**
 * https://coda.io/d/_dL_vOIbEHfo/UI-Formatting_su1Fc#_luQUp
 */
export const useFormatNftAmount = () => {
    const { formatNumber } = useIntl()

    return useCallback(
        ({ nft, transferAmount }: Props): string | null => {
            const power = BigInt(10) ** BigInt(nft.decimals)

            const dollars = transferAmount / power
            const amount = new Big(transferAmount.toString())
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

            return formatNumber(amount, options)
        },
        [formatNumber]
    )
}

export const FormattedNftAmount = ({ nft, transferAmount }: Props) => {
    const format = useFormatNftAmount()

    return <>{format({ nft, transferAmount })}</>
}
