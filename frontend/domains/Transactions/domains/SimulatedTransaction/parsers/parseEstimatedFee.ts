import { components } from '@zeal/api/portfolio'

import {
    match,
    nullableOf,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    ValidObject,
} from '@zeal/toolkit/Result'

import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import {
    Eip1559Fee,
    EstimatedFee,
    LegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'

export const parseEIP1559Fee = (input: unknown): Result<unknown, Eip1559Fee> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'Eip1559Fee' as const),
            maxPriorityFeePerGas: string(dto.maxPriorityFeePerGas),
            maxFeePerGas: string(dto.maxFeePerGas),
            priceInDefaultCurrency: nullableOf(
                dto.priceInDefaultCurrency,
                parseMoney
            ),
            maxPriceInDefaultCurrency: nullableOf(
                dto.maxPriceInDefaultCurrency,
                parseMoney
            ),
            maxPriceInNativeCurrency: parseMoney(dto.maxPriceInNativeCurrency),
            priceInNativeCurrency: parseMoney(dto.priceInNativeCurrency),
            forecastDuration: parseForecastDuration(dto.forecastDuration),
        })
    )

export const parseLegacyFee = (input: unknown): Result<unknown, LegacyFee> =>
    object(input).andThen((dto) =>
        shape({
            type: match(dto.type, 'LegacyFee' as const),
            gasPrice: string(dto.gasPrice),
            priceInDefaultCurrency: nullableOf(
                dto.priceInDefaultCurrency,
                parseMoney
            ),
            priceInNativeCurrency: parseMoney(dto.priceInNativeCurrency),
            maxPriceInDefaultCurrency: nullableOf(
                dto.maxPriceInDefaultCurrency,
                parseMoney
            ),
            maxPriceInNativeCurrency: parseMoney(dto.maxPriceInNativeCurrency),
            forecastDuration: parseForecastDuration(dto.forecastDuration),
        })
    )

const parseForecastDuration = (
    input: unknown
): Result<unknown, components['schemas']['ForecastDuration']> => {
    return object(input).andThen((obj) =>
        oneOf(obj, [
            parseForecastDurationWithinForecast(obj),
            parseForecastDurationOutsideOfForecast(obj),
        ])
    )
}

const parseForecastDurationWithinForecast = (
    obj: ValidObject
): Result<unknown, components['schemas']['WithinForecast']> =>
    shape({
        type: match(obj.type, 'WithinForecast' as const),
        durationMs: number(obj.durationMs),
    })

const parseForecastDurationOutsideOfForecast = (
    obj: ValidObject
): Result<unknown, components['schemas']['OutsideOfForecast']> =>
    shape({
        type: match(obj.type, 'OutsideOfForecast' as const),
    })

export const parseEstimatedFee = (
    input: unknown
): Result<unknown, EstimatedFee> =>
    oneOf(input, [parseEIP1559Fee(input), parseLegacyFee(input)])
