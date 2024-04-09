import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { ImperativeError } from '@zeal/domains/Error'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { getEip1559CustomFee } from './getEip1559CustomFee'
import { getLegacyCustomFee } from './getLegacyCustomFee'

type Response =
    | {
          type: 'legacy'
          fee: components['schemas']['LegacyCustomPresetRequestFee']
          networkState: components['schemas']['LegacyNetworkState'] | null
      }
    | {
          type: 'eip1559'
          fee: components['schemas']['Eip1559CustomPresetRequestFee']
          networkState: components['schemas']['Eip1559NetworkState'] | null
      }

export const getCustomFee = (
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
): Response => {
    switch (pollableData.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            switch (pollableData.data.type) {
                case 'FeesForecastResponseLegacyFee':
                    return {
                        type: 'legacy',
                        fee: getLegacyCustomFee(
                            pollableData.params,
                            pollableData.data
                        ),
                        networkState: pollableData.data.networkState,
                    }

                case 'FeesForecastResponseEip1559Fee':
                    return {
                        type: 'eip1559',
                        fee: getEip1559CustomFee(
                            pollableData.params,
                            pollableData.data
                        ),
                        networkState: pollableData.data.networkState,
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(pollableData.data)
            }
        case 'error':
        case 'loading':
            switch (pollableData.params.network.trxType) {
                case 'eip1559': {
                    switch (pollableData.params.selectedPreset.type) {
                        case 'Slow':
                        case 'Normal':
                        case 'Fast':
                            return {
                                type: 'eip1559',
                                fee: {
                                    type: 'Eip1559CustomPresetRequestFee',
                                    maxBaseFee: `0x0`, // we don't know ATM
                                    maxPriorityFee: `0x0`,
                                },
                                networkState: null,
                            }
                        case 'Custom':
                            switch (
                                pollableData.params.selectedPreset.fee.type
                            ) {
                                case 'LegacyCustomPresetRequestFee':
                                    throw new ImperativeError(
                                        `we cannot have legacy fee on network`,
                                        { network: pollableData.params.network }
                                    )
                                case 'Eip1559CustomPresetRequestFee':
                                    return {
                                        type: 'eip1559',
                                        fee: pollableData.params.selectedPreset
                                            .fee,
                                        networkState: null,
                                    }
                                /* istanbul ignore next */
                                default:
                                    return notReachable(
                                        pollableData.params.selectedPreset.fee
                                    )
                            }
                        /* istanbul ignore next */
                        default:
                            return notReachable(
                                pollableData.params.selectedPreset
                            )
                    }
                }
                case 'legacy': {
                    switch (pollableData.params.selectedPreset.type) {
                        case 'Slow':
                        case 'Normal':
                        case 'Fast':
                            return {
                                type: 'legacy',
                                fee: {
                                    type: 'LegacyCustomPresetRequestFee',
                                    gasPrice: '0x0',
                                },
                                networkState: null,
                            }
                        case 'Custom':
                            switch (
                                pollableData.params.selectedPreset.fee.type
                            ) {
                                case 'LegacyCustomPresetRequestFee':
                                    return {
                                        type: 'legacy',
                                        fee: pollableData.params.selectedPreset
                                            .fee,
                                        networkState: null,
                                    }
                                case 'Eip1559CustomPresetRequestFee':
                                    throw new ImperativeError(
                                        `we cannot have legacy fee on`,
                                        { network: pollableData.params.network }
                                    )

                                /* istanbul ignore next */
                                default:
                                    return notReachable(
                                        pollableData.params.selectedPreset.fee
                                    )
                            }

                        /* istanbul ignore next */
                        default:
                            return notReachable(
                                pollableData.params.selectedPreset
                            )
                    }
                }
                /* istanbul ignore next */
                default:
                    return notReachable(pollableData.params.network.trxType)
            }

        /* istanbul ignore next */
        default:
            return notReachable(pollableData)
    }
}
