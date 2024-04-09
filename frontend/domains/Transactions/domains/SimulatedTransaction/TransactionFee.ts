import { components } from '@zeal/api/portfolio'

import { Money } from '@zeal/domains/Money'

// TODO Is it in correct place in structure for those types?

export type EstimatedFee = LegacyFee | Eip1559Fee

export type LegacyFee = {
    type: 'LegacyFee'
    gasPrice: string

    maxPriceInDefaultCurrency: Money | null
    maxPriceInNativeCurrency: Money
    priceInDefaultCurrency: Money | null
    priceInNativeCurrency: Money
    forecastDuration: components['schemas']['ForecastDuration']
}

export type Eip1559Fee = {
    type: 'Eip1559Fee'
    maxPriorityFeePerGas: string
    maxFeePerGas: string

    maxPriceInDefaultCurrency: Money | null
    maxPriceInNativeCurrency: Money
    priceInDefaultCurrency: Money | null
    priceInNativeCurrency: Money
    forecastDuration: components['schemas']['ForecastDuration']
}
