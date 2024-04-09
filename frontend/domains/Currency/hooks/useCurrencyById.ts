import { useEffect } from 'react'

import { Currency, CurrencyId, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

export const useCurrencyById = (
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): Currency | null => {
    const currency = knownCurrencies[currencyId] || null

    useEffect(() => {
        if (!currency) {
            captureError(
                new ImperativeError('Unknown currency picked from record', {
                    currency: currencyId,
                })
            )
        }
    }, [currency, currencyId])

    return currency
}
