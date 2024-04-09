import { notReachable } from '@zeal/toolkit'

import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'

export const getCryptoCurrency = (
    currencyId: CurrencyId,
    knownCurrencies: KnownCurrencies
): CryptoCurrency => {
    const currency = knownCurrencies[currencyId] || null

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
