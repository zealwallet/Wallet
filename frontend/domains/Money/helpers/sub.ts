import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'

export const sub = (a: Money, b: Money) => {
    if (a.currencyId !== b.currencyId) {
        throw new ImperativeError(
            'subtracting monies of different currencies',
            { a: a.currencyId, b: b.currencyId }
        )
    }

    return {
        amount: a.amount - b.amount,
        currencyId: a.currencyId,
    }
}
