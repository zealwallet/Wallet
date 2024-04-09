import { notReachable } from '@zeal/toolkit'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'

import { SafetyCheckAndFeeValidationErrorPopup } from './SafetyCheckAndFeeValidationErrorPopup'
import { SafetyChecksConfirmation } from './SafetyChecksConfirmation'
import { SimulationFailedConfirmation } from './SimulationFailedConfirmation'

import { FeeValidationConfirmationPopup } from '../../../../../FeeValidationConfirmationPopup'
import { UserConfirmationRequired } from '../../helpers/validation'

type Props = {
    reason: UserConfirmationRequired
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const UserConfirmationPopup = ({ reason, onMsg }: Props) => {
    switch (reason.type) {
        case 'safety_check_failed':
            return (
                <SafetyChecksConfirmation
                    knownCurrencies={
                        reason.simulated.simulation.simulation.currencies
                    }
                    failedSafetyChecks={reason.failedChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'safety_check_confirm_clicked':
                                onMsg({
                                    type: 'user_confirmed_transaction_for_signing',
                                    keyStore: reason.keystore,
                                    transactionRequest: reason.simulated,
                                })
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'safety_check_and_fee_validation_error':
            return (
                <SafetyCheckAndFeeValidationErrorPopup
                    onMsg={onMsg}
                    error={reason}
                />
            )

        case 'trx_may_take_long_to_proceed_base_fee_low':
        case 'trx_may_take_long_to_proceed_gas_price_low':
        case 'trx_may_take_long_to_proceed_priority_fee_low':
        case 'trx_likely_to_fail':
        case 'nonce_range_error_bigger_than_current':
            return (
                <FeeValidationConfirmationPopup onMsg={onMsg} reason={reason} />
            )

        case 'simulation_failed_safety_checks':
            return (
                <SimulationFailedConfirmation reason={reason} onMsg={onMsg} />
            )

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}
