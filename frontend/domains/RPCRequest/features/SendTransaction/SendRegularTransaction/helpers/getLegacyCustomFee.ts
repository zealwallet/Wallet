import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'

import { ImperativeError } from '@zeal/domains/Error'
import {
    FeeForecastRequest,
    FeesForecastResponseLegacyFee,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'

export const getLegacyCustomFee = (
    request: FeeForecastRequest,
    response: FeesForecastResponseLegacyFee
): components['schemas']['LegacyCustomPresetRequestFee'] => {
    const selectedPreset = request.selectedPreset
    switch (selectedPreset.type) {
        case 'Slow':
            return {
                type: 'LegacyCustomPresetRequestFee',
                gasPrice: response.slow.gasPrice,
            }

        case 'Normal':
            return {
                type: 'LegacyCustomPresetRequestFee',
                gasPrice: response.normal.gasPrice,
            }

        case 'Fast':
            return {
                type: 'LegacyCustomPresetRequestFee',
                gasPrice: response.fast.gasPrice,
            }

        case 'Custom':
            switch (selectedPreset.fee.type) {
                case 'Eip1559CustomPresetRequestFee':
                    throw new ImperativeError(
                        'Impossible state, selected eip1559 response is legacy'
                    )

                case 'LegacyCustomPresetRequestFee':
                    return selectedPreset.fee

                default:
                    return notReachable(selectedPreset.fee)
            }

        default:
            return notReachable(selectedPreset)
    }
}
