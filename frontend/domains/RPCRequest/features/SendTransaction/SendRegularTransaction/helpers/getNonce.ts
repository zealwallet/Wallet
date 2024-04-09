import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'

export const getNonce = (
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>,
    nonce: number
): number => {
    switch (pollableData.params.selectedPreset.type) {
        case 'Slow':
        case 'Normal':
        case 'Fast':
            switch (pollableData.type) {
                case 'loaded':
                case 'reloading':
                case 'subsequent_failed':
                    return pollableData.data.nonce

                case 'loading':
                case 'error':
                    return nonce

                default:
                    return notReachable(pollableData)
            }
        case 'Custom':
            return pollableData.params.selectedPreset.fee.nonce

        default:
            return notReachable(pollableData.params.selectedPreset)
    }
}
