import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'

export const moneyToNumber = (
    money: Money,
    knownCurrencies: KnownCurrencies
): number => {
    const currency = knownCurrencies[money.currencyId]

    return Big(money.amount.toString())
        .div(Big(10).pow(currency.fraction))
        .toNumber()
}
