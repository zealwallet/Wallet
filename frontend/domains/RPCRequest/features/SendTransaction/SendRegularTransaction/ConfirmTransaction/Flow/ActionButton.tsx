import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { KeyStore, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import {
    UserConfirmationRequired,
    validateSubmit,
} from './Simulation/helpers/validation'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulationResult: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'continue_button_clicked'
          keyStore: SigningKeyStore
          simulated: Simulated
      }
    | { type: 'import_keys_button_clicked' }
    | {
          type: 'user_confirmation_requested'
          reason: UserConfirmationRequired
      }

export const ActionButton = ({
    pollableData,
    transactionRequest,
    keystore,
    simulationResult,
    nonce,
    gasEstimate,
    onMsg,
}: Props) => {
    const submitValidation = validateSubmit({
        pollableData,
        transactionRequest,
        keystore,
        simulationResult: simulationResult,
        nonce,
        gasEstimate,
    })

    switch (submitValidation.type) {
        case 'Failure':
            const reason = submitValidation.reason
            switch (reason.type) {
                case 'import_private_keys_required':
                    return (
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({ type: 'import_keys_button_clicked' })
                            }
                        >
                            <FormattedMessage
                                id="confirmTransaction.importKeys"
                                defaultMessage="Import keys"
                            />
                        </Button>
                    )
                case 'trx_may_take_long_to_proceed_base_fee_low':
                case 'trx_may_take_long_to_proceed_gas_price_low':
                case 'trx_may_take_long_to_proceed_priority_fee_low':
                case 'trx_likely_to_fail':
                case 'safety_check_and_fee_validation_error':
                case 'nonce_range_error_bigger_than_current':
                case 'safety_check_failed':
                case 'simulation_failed_safety_checks':
                    return (
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({
                                    type: 'user_confirmation_requested',
                                    reason,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.submit"
                                defaultMessage="Submit"
                            />
                        </Button>
                    )

                case 'not_enough_balance':
                case 'trx_will_fail_less_then_minimum_gas':
                case 'pollable_errored_and_user_did_not_selected_custom_preset':
                case 'pollable_data_loading':
                case 'nonce_range_error_less_than_current':
                    return (
                        <Button size="regular" variant="primary" disabled>
                            <FormattedMessage
                                id="action.submit"
                                defaultMessage="Submit"
                            />
                        </Button>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(reason)
            }

        case 'Success':
            return (
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'continue_button_clicked',
                            keyStore: submitValidation.data.keystore,
                            simulated: submitValidation.data.simulated,
                        })
                    }
                >
                    <FormattedMessage
                        id="action.submit"
                        defaultMessage="Submit"
                    />
                </Button>
            )
        /* istanbul ignore next */
        default:
            return notReachable(submitValidation)
    }
}
