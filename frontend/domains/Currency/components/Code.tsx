import React from 'react'

import { CurrencyId, KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'

type Props = {
    knownCurrencies: KnownCurrencies
    currencyId: CurrencyId
}

export const Code = ({ currencyId, knownCurrencies }: Props) => {
    const currency = useCurrencyById(currencyId, knownCurrencies)

    if (!currency) {
        return null
    }

    return <>{currency.code}</>
}
