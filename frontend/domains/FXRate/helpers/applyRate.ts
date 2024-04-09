import Big from 'big.js'

import { Currency, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate, FXRate2 } from '@zeal/domains/FXRate'
import { Money, MoneyByCurrency } from '@zeal/domains/Money'

// FIXME @resetko-zeal kill
export const applyRate = (
    baseAmount: Money,
    rate: FXRate,
    currencies: KnownCurrencies
): Money => {
    const base = currencies[rate.base] || null
    const quote = currencies[rate.quote] || null

    if (!base || !quote) {
        throw new ImperativeError(
            'Base or Quote currency is missing in dictionary'
        )
    }

    const amount = BigInt(
        Big(baseAmount.amount.toString())
            .div(Big(10).pow(base.fraction))
            .mul(rate.rate.toString())
            .toFixed(0)
    )

    return {
        amount,
        currencyId: quote.id,
    }
}

export const applyRate2 = <B extends Currency, Q extends Currency>({
    baseAmount,
    rate,
}: {
    rate: FXRate2<B, Q>
    baseAmount: MoneyByCurrency<B>
}): MoneyByCurrency<Q> => {
    const { base, quote } = rate

    const amount = BigInt(
        Big(baseAmount.amount.toString())
            .div(Big(10).pow(base.fraction))
            .mul(rate.rate.toString())
            .toFixed(0)
    )

    return {
        amount,
        currency: quote,
    } as MoneyByCurrency<Q>
}
