import React, { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { NotEnoughBalance } from './NotEnoughBalance'
import { PollableErroredAndUserDidNotSelectedCustomPreset } from './PollableErroredAndUserDidNotSelectedCustomPreset'
import { Skeleton } from './Skeleton'
import { Success } from './Success'

import { validateEditFeeWidget } from '../helpers/validation'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    pollingInterval: number
    pollingStartedAt: number
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_forecast_fee_error_reload_click' }
    | {
          type: 'on_forecast_subsequent_failed_reload_click'
          data: FeeForecastResponse
      }

export const EditDisabled = ({
    pollableData,
    simulateTransactionResponse,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    nonce,
    gasEstimate,
    keystore,
    onMsg,
}: Props) => {
    const widgetValidation = validateEditFeeWidget({
        transactionRequest,
        pollableData,
        simulationResult: simulateTransactionResponse,
        nonce,
        gasEstimate,
        keystore,
    })

    useEffect(() => {
        switch (widgetValidation.type) {
            case 'Failure':
                switch (widgetValidation.reason.type) {
                    case 'pollable_data_loading':
                    case 'not_enough_balance':
                    case 'pollable_failed_to_fetch':
                        break
                    case 'nonce_range_error_bigger_than_current':
                    case 'nonce_range_error_less_than_current':
                    case 'trx_will_fail_less_then_minimum_gas':
                    case 'trx_likely_to_fail':
                    case 'trx_may_take_long_to_proceed_base_fee_low':
                    case 'trx_may_take_long_to_proceed_gas_price_low':
                    case 'trx_may_take_long_to_proceed_priority_fee_low':
                        captureError(
                            new ImperativeError(
                                `we should not see this error in L2 networks during edit widget`,
                                { reason: widgetValidation.reason.type }
                            )
                        )
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(widgetValidation.reason)
                }
                break
            case 'Success':
                break
            /* istanbul ignore next */
            default:
                return notReachable(widgetValidation)
        }
    }, [widgetValidation])

    switch (widgetValidation.type) {
        case 'Failure':
            switch (widgetValidation.reason.type) {
                case 'pollable_failed_to_fetch':
                    return (
                        <PollableErroredAndUserDidNotSelectedCustomPreset
                            error={widgetValidation.reason}
                            onMsg={onMsg}
                        />
                    )

                case 'trx_may_take_long_to_proceed_base_fee_low':
                case 'trx_may_take_long_to_proceed_gas_price_low':
                case 'trx_may_take_long_to_proceed_priority_fee_low':
                case 'nonce_range_error_less_than_current':
                case 'nonce_range_error_bigger_than_current':
                case 'trx_will_fail_less_then_minimum_gas':
                case 'trx_likely_to_fail':
                    return (
                        <Success
                            pollingStartedAt={pollingStartedAt}
                            pollingInterval={pollingInterval}
                            pollable={widgetValidation.reason.pollable}
                            onMsg={onMsg}
                        />
                    )

                case 'not_enough_balance':
                    return (
                        <NotEnoughBalance
                            pollingStartedAt={pollingStartedAt}
                            pollingInterval={pollingInterval}
                            error={widgetValidation.reason}
                        />
                    )

                case 'pollable_data_loading':
                    return <Skeleton />

                /* istanbul ignore next */
                default:
                    return notReachable(widgetValidation.reason)
            }

        case 'Success':
            return (
                <Success
                    pollingStartedAt={pollingStartedAt}
                    pollingInterval={pollingInterval}
                    pollable={widgetValidation.data.pollable}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(widgetValidation)
    }
}
