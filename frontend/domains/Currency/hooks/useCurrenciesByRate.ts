import { useEffect } from 'react'

import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { FXRate } from '@zeal/domains/FXRate'

export const useCurrenciesByRate = (
    rate: FXRate,
    knownCurrencies: KnownCurrencies
): { base: Currency; quote: Currency } => {
    const base = knownCurrencies[rate.base] || null
    const quote = knownCurrencies[rate.quote] || null

    useEffect(() => {
        if (!quote) {
            captureError(
                new ImperativeError('Unknown quote currency in rate', {
                    currency: rate.quote,
                })
            )
        }

        if (!base) {
            captureError(
                new ImperativeError('Unknown base currency in rate', {
                    currency: rate.base,
                })
            )
        }
    }, [base, quote, rate])

    return { base, quote }
}
