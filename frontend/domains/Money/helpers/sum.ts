import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'

export const sum = (money: Money[]): Money | null => {
    if (!money.length) {
        return null
    }

    return money.reduce((previousValue, currentValue) => {
        if (previousValue.currencyId !== currentValue.currencyId) {
            // TODO :: report to sentry & throw only in dev
            throw new ImperativeError(
                `you are trying to sum money in different currencies`,
                {
                    previousCurrency: previousValue.currencyId,
                    currentCurrency: currentValue.currencyId,
                }
            )
        }
        return {
            ...previousValue,
            amount: previousValue.amount + currentValue.amount,
        }
    })
}
