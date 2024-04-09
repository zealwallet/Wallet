import Big from 'big.js'

import { Money, Money2 } from '@zeal/domains/Money'

export const mulByNumber = (a: Money, b: number): Money => ({
    amount: BigInt(Big(a.amount.toString()).mul(b).toFixed(0)),
    currencyId: a.currencyId,
})

export const mulByNumber2 = <T extends Money2>(a: T, b: number): T =>
    ({
        amount: BigInt(Big(a.amount.toString()).mul(b).toFixed(0)),
        currency: a.currency,
    } as T)
