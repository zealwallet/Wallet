import { PredefinedPreset } from '@zeal/domains/Transactions/api/fetchFeeForecast'

export const CANCEL_GAS_AMOUNT = '0x5208'

export const DEFAULT_FEE_PRESET: PredefinedPreset = { type: 'Normal' }

export const DEFAULT_CANCEL_FEE_PRESET: PredefinedPreset = {
    type: 'Fast',
}

export const DEFAULT_SPEEDUP_FEE_PRESET: PredefinedPreset = {
    type: 'Fast',
}
