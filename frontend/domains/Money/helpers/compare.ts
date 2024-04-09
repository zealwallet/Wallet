import { ImperativeError } from '@zeal/domains/Error'
import { Money, Money2 } from '@zeal/domains/Money'

export const compare = (a: Money, b: Money): number => {
    if (a.currencyId !== b.currencyId) {
        throw new ImperativeError(`You can not compare different currencies `, {
            a: a.currencyId,
            b: b.currencyId,
        })
    }

    if (a.amount < b.amount) {
        return -1
    } else if (a.amount > b.amount) {
        return 1
    } else {
        return 0
    }
}

export const compare2 = (a: Money2, b: Money2): number => {
    if (a.currency.id !== b.currency.id) {
        throw new ImperativeError(`You can not compare different currencies `, {
            a: a.currency.id,
            b: b.currency.id,
        })
    }

    if (a.amount < b.amount) {
        return -1
    } else if (a.amount > b.amount) {
        return 1
    } else {
        return 0
    }
}

export const isGreaterThan = (a: Money, b: Money): boolean => compare(a, b) > 0

export const isGreaterThan2 = (a: Money2, b: Money2): boolean =>
    compare2(a, b) > 0
