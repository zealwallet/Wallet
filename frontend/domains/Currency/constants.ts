import {
    CurrencyId,
    FiatCurrency,
    FiatCurrencyCode,
} from '@zeal/domains/Currency'

export const DEFAULT_CURRENCY_ID = 'USD' as CurrencyId

export const FIAT_CURRENCIES: Record<FiatCurrencyCode, FiatCurrency> = {
    GBP: {
        type: 'FiatCurrency',
        id: 'GBP',
        symbol: '£',
        code: 'GBP',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'British Pound',
    },
    EUR: {
        type: 'FiatCurrency',
        id: 'EUR',
        symbol: '€',
        code: 'EUR',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'Euro',
    },
    NGN: {
        type: 'FiatCurrency',
        id: 'NGN',
        symbol: '₦',
        code: 'NGN',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'Nigerian Naira',
    },
    PLN: {
        type: 'FiatCurrency',
        id: 'PLN',
        symbol: 'zł',
        code: 'PLN',
        fraction: 18,
        rateFraction: 18,
        icon: 'TODO',
        name: 'Polish Zloty',
    },
}
