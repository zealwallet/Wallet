import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'

import { ImperativeError } from '@zeal/domains/Error'
import {
    FeeForecastRequest,
    FeesForecastResponseEip1559Fee,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'

export const getEip1559CustomFee = (
    request: FeeForecastRequest,
    response: FeesForecastResponseEip1559Fee
): components['schemas']['Eip1559CustomPresetRequestFee'] => {
    const selectedPreset = request.selectedPreset
    switch (selectedPreset.type) {
        case 'Slow':
            return {
                type: 'Eip1559CustomPresetRequestFee',
                maxBaseFee: `0x${(
                    BigInt(response.slow.maxFeePerGas) -
                    BigInt(response.slow.maxPriorityFeePerGas)
                ).toString(16)}`,
                maxPriorityFee: response.slow.maxPriorityFeePerGas,
            }

        case 'Normal':
            return {
                type: 'Eip1559CustomPresetRequestFee',
                maxBaseFee: `0x${(
                    BigInt(response.normal.maxFeePerGas) -
                    BigInt(response.normal.maxPriorityFeePerGas)
                ).toString(16)}`,
                maxPriorityFee: response.normal.maxPriorityFeePerGas,
            }

        case 'Fast':
            return {
                type: 'Eip1559CustomPresetRequestFee',
                maxBaseFee: `0x${(
                    BigInt(response.fast.maxFeePerGas) -
                    BigInt(response.fast.maxPriorityFeePerGas)
                ).toString(16)}`,
                maxPriorityFee: response.fast.maxPriorityFeePerGas,
            }

        case 'Custom': {
            switch (selectedPreset.fee.type) {
                case 'LegacyCustomPresetRequestFee':
                    throw new ImperativeError(
                        'Impossible state, selected legacy response is eip1559'
                    )

                case 'Eip1559CustomPresetRequestFee':
                    return selectedPreset.fee

                default:
                    return notReachable(selectedPreset.fee)
            }
        }

        default:
            return notReachable(selectedPreset)
    }
}
