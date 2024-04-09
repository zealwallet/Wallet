import { Currency, CurrencyPinMap } from '@zeal/domains/Currency'

export const sortCurrencyByPinStatus =
    (currencyPinMap: CurrencyPinMap) =>
    (a: Currency, b: Currency): number => {
        const aToNumber = currencyPinMap[a.id] ? 0 : 1
        const bToNumber = currencyPinMap[b.id] ? 0 : 1
        return aToNumber - bToNumber
    }
