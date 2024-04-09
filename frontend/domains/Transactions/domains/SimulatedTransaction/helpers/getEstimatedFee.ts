import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

export const getEstimatedFee = (
    pollable: Extract<
        PollableData<FeeForecastResponse, FeeForecastRequest>,
        { type: 'loaded' | 'reloading' | 'subsequent_failed' }
    >
): EstimatedFee | null => {
    switch (pollable.params.selectedPreset.type) {
        case 'Slow':
            return pollable.data.slow

        case 'Normal':
            return pollable.data.normal

        case 'Fast':
            return pollable.data.fast

        case 'Custom':
            return pollable.data.custom

        /* istanbul ignore next */
        default:
            return notReachable(pollable.params.selectedPreset)
    }
}
