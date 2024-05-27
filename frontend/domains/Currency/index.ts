import { Address } from '@zeal/domains/Address'
import { NetworkHexId } from '@zeal/domains/Network'

export type Currency = FiatCurrency | CryptoCurrency

export type FiatCurrency = {
    type: 'FiatCurrency'
    id: string
    symbol: string
    code: string
    fraction: number
    rateFraction: number
    icon: string
    name: string
}

export type CryptoCurrency = {
    type: 'CryptoCurrency'
    id: string
    address: Address
    networkHexChainId: NetworkHexId
    symbol: string
    code: string
    fraction: number
    rateFraction: number
    icon: string
    name: string
}

export type CurrencyId = string
export type KnownCurrencies = Record<CurrencyId, Currency>

export type CurrencyPinMap = Record<CurrencyId, boolean>
export type CurrencyHiddenMap = Record<CurrencyId, boolean>
export type GasCurrencyPresetMap = Record<NetworkHexId, CurrencyId>

export type FiatCurrencyCode = 'GBP' | 'EUR' | 'NGN' | 'PLN'
