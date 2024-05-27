import { values } from '@zeal/toolkit/Object'

import {
    CryptoCurrency,
    Currency,
    CurrencyId,
    FiatCurrency,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { FIAT_CURRENCIES } from '@zeal/domains/Currency/constants'
import { USD } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { NetworkHexId } from '@zeal/domains/Network'

type UnblockFiatCurrencies = 'GBP' | 'EUR' | 'NGN'

export type BankTransferFiatCurrencies = Record<
    UnblockFiatCurrencies,
    FiatCurrency
>

const UNBLOCK_FIAT_CURRENCIES_MAP: BankTransferFiatCurrencies = {
    GBP: FIAT_CURRENCIES['GBP'],
    EUR: FIAT_CURRENCIES['EUR'],
    NGN: FIAT_CURRENCIES['NGN'],
}

export const UNBLOCK_SUSPENDED_FIAT_CURRENCY_CODES: string[] = ['NGN']

export type BankTransferCurrencies = {
    defaultCryptoCurrency: CryptoCurrency
    fiatCurrencies: BankTransferFiatCurrencies
    knownCurrencies: KnownCurrencies
}

const POLYGON_BRIDGED_USDC: CryptoCurrency = {
    type: 'CryptoCurrency',
    id: 'Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC.e',
    code: 'USDC.e',
    fraction: 6,
    rateFraction: 6,
    icon: 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/wallet/image/currency/Polygon|0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    name: 'USD Coin (PoS)',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    networkHexChainId: '0x89' as NetworkHexId,
}

export const fetchBankTransferCurrencies =
    (): Promise<BankTransferCurrencies> =>
        new Promise<BankTransferCurrencies>((resolve) => {
            const knownCurrencies = [
                POLYGON_BRIDGED_USDC,
                USD,
                ...values(UNBLOCK_FIAT_CURRENCIES_MAP),
            ].reduce((record, currency) => {
                record[currency.id] = currency
                return record
            }, {} as Record<CurrencyId, Currency>)

            resolve({
                fiatCurrencies: UNBLOCK_FIAT_CURRENCIES_MAP,
                defaultCryptoCurrency: POLYGON_BRIDGED_USDC,
                knownCurrencies,
            })
        })
