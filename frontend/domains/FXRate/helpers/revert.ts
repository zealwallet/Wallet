import Big from 'big.js'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { FXRate } from '@zeal/domains/FXRate'

export const revert = (
    rate: FXRate,
    knownCurrency: KnownCurrencies
): FXRate => {
    const baseCurrency = knownCurrency[rate.base]
    const quoteCurrency = knownCurrency[rate.quote]
    const basePower = Big(10).pow(baseCurrency.rateFraction)
    const quotePower = Big(10).pow(quoteCurrency.rateFraction)
    const baseRate = Big(rate.rate.toString()).div(basePower)
    const revertRate = Big(1).div(baseRate)
    const addedFraction = revertRate.mul(quotePower)
    const final = addedFraction.toFixed(0)

    return {
        base: rate.quote,
        quote: rate.base,
        rate: BigInt(final),
    }
}
