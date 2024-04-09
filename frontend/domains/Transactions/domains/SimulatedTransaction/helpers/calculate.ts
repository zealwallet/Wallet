import { components } from '@zeal/api/portfolio'
import { Big } from 'big.js'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { toHex } from '@zeal/toolkit/Number'

import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import {
    Eip1559Fee,
    EstimatedFee,
    LegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type LoadedPollable = Extract<
    PollableData<FeeForecastResponse, FeeForecastRequest>,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

const MUL = Big('1.11') //at least 10%

export const calculate = (
    old: EstimatedFee | components['schemas']['CustomPresetRequestFee'],
    newFee: EstimatedFee
): EstimatedFee => {
    switch (old.type) {
        case 'LegacyCustomPresetRequestFee':
        case 'LegacyFee':
            switch (newFee.type) {
                case 'LegacyFee':
                    return calculateLegacyFee(old, newFee)
                case 'Eip1559Fee':
                    throw new ImperativeError(
                        'cannot mix legacy and Eip1559Fee fees'
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(newFee)
            }
        case 'Eip1559Fee':
        case 'Eip1559CustomPresetRequestFee':
            switch (newFee.type) {
                case 'LegacyFee':
                    throw new ImperativeError(
                        'cannot mix Eip1559Fee and legacy fees'
                    )
                case 'Eip1559Fee':
                    return calculateEip1559Fee(old, newFee)
                /* istanbul ignore next */
                default:
                    return notReachable(newFee)
            }
        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

export const mergeFastFee = (
    pollable: LoadedPollable,
    newFastFee: EstimatedFee
): LoadedPollable => {
    switch (pollable.data.type) {
        case 'FeesForecastResponseLegacyFee':
            switch (newFastFee.type) {
                case 'LegacyFee':
                    return {
                        ...pollable,
                        data: {
                            ...pollable.data,
                            type: 'FeesForecastResponseLegacyFee',
                            fast: newFastFee,
                        },
                    }
                case 'Eip1559Fee':
                    throw new ImperativeError(
                        'cannot mix legacy and Eip1559Fee fees'
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(newFastFee)
            }
        case 'FeesForecastResponseEip1559Fee':
            switch (newFastFee.type) {
                case 'LegacyFee':
                    throw new ImperativeError(
                        'cannot mix legacy and Eip1559Fee fees'
                    )
                case 'Eip1559Fee':
                    return {
                        ...pollable,
                        data: {
                            ...pollable.data,
                            type: 'FeesForecastResponseEip1559Fee',
                            fast: newFastFee,
                        },
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(newFastFee)
            }
        /* istanbul ignore next */
        default:
            return notReachable(pollable.data)
    }
}

const calculateEip1559Fee = (
    old: Eip1559Fee | components['schemas']['Eip1559CustomPresetRequestFee'],
    newFee: Eip1559Fee
): Eip1559Fee => {
    switch (old.type) {
        case 'Eip1559CustomPresetRequestFee':
            return newFee
        case 'Eip1559Fee':
            const { base: oldBase, priority: oldPriority } = splitFee(old)
            const { base: newBase, priority: newPriority } = splitFee(newFee)
            const calculatedBase = compare(oldBase, newBase, MUL)
            const calculatedPriority = compare(oldPriority, newPriority, MUL)
            const calculatedFee = calculatedBase.add(calculatedPriority)
            const rate = calculatedFee.div(toBig(newFee.maxFeePerGas))

            return {
                type: 'Eip1559Fee',
                maxPriorityFeePerGas: bigToHex(calculatedPriority),
                forecastDuration: newFee.forecastDuration,
                maxFeePerGas: bigToHex(calculatedFee),
                priceInNativeCurrency: mulMoney(
                    newFee.priceInNativeCurrency,
                    rate
                ),
                maxPriceInNativeCurrency: mulMoney(
                    newFee.maxPriceInNativeCurrency,
                    rate
                ),
                maxPriceInDefaultCurrency: newFee.maxPriceInDefaultCurrency
                    ? mulMoney(newFee.maxPriceInDefaultCurrency, rate)
                    : null,
                priceInDefaultCurrency: newFee.priceInDefaultCurrency
                    ? mulMoney(newFee.priceInDefaultCurrency, rate)
                    : null,
            }

        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

const calculateLegacyFee = (
    old: LegacyFee | components['schemas']['LegacyCustomPresetRequestFee'],
    newFee: LegacyFee
): LegacyFee => {
    switch (old.type) {
        case 'LegacyCustomPresetRequestFee':
            return newFee
        case 'LegacyFee':
            const oldGasPriceWithMultiplier = toBig(old.gasPrice).mul(MUL)
            const newPrice = toBig(newFee.gasPrice)
            if (oldGasPriceWithMultiplier.gte(newPrice)) {
                return {
                    type: 'LegacyFee',
                    gasPrice: bigToHex(oldGasPriceWithMultiplier),
                    forecastDuration: newFee.forecastDuration,
                    priceInDefaultCurrency: old.priceInDefaultCurrency
                        ? mulMoney(old.priceInDefaultCurrency, MUL)
                        : null,
                    priceInNativeCurrency: mulMoney(
                        old.priceInNativeCurrency,
                        MUL
                    ),
                    maxPriceInDefaultCurrency: old.maxPriceInDefaultCurrency
                        ? mulMoney(old.maxPriceInDefaultCurrency, MUL)
                        : null,
                    maxPriceInNativeCurrency: mulMoney(
                        old.maxPriceInNativeCurrency,
                        MUL
                    ),
                }
            }

            return newFee

        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

const mulMoney = (money: Money, mul: Big): Money => {
    return {
        amount: BigInt(
            Big(money.amount.toString(10))
                .mul(mul)
                .toFixed(0, Big.roundUp)
                .toString()
        ),
        currencyId: money.currencyId,
    }
}

const bigToHex = (big: Big): string => {
    return toHex(BigInt(big.toFixed(0, Big.roundUp)))
}

const toBig = (hex: string): Big => {
    return Big(BigInt(hex).toString(10))
}

const splitFee = (fee: Eip1559Fee): { base: Big; priority: Big } => {
    const base = toBig(fee.maxFeePerGas).sub(toBig(fee.maxPriorityFeePerGas))
    return {
        base,
        priority: toBig(fee.maxPriorityFeePerGas),
    }
}

const compare = (oldFee: Big, newFee: Big, mul: Big): Big => {
    const oldWithM = oldFee.mul(mul)
    return oldWithM.gte(newFee) ? oldWithM : newFee
}
