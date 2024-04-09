import { CryptoCurrency, Currency, FiatCurrency } from '@zeal/domains/Currency'

export type Money = {
    amount: bigint
    currencyId: string
}

export type CryptoMoney = {
    amount: bigint
    currency: CryptoCurrency
}

export type FiatMoney = {
    amount: bigint
    currency: FiatCurrency
}

export type Money2 = FiatMoney | CryptoMoney

export type MoneyByCurrency<T extends Currency> = T extends CryptoCurrency
    ? CryptoMoney
    : T extends FiatCurrency
    ? FiatMoney
    : never
