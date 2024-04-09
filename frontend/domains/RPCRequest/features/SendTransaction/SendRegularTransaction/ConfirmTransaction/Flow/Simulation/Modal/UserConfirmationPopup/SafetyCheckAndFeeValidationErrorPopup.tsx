import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'

import { SafetyChecksConfirmation } from './SafetyChecksConfirmation'

import { FeeValidationConfirmationPopup } from '../../../../../FeeValidationConfirmationPopup'
import { SafetyCheckAndFeeValidationError } from '../../helpers/validation'

type Props = {
    error: SafetyCheckAndFeeValidationError
    onMsg: (msg: Msg) => void
}

type State = 'confirm_checks' | 'confirm_fees'

type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const SafetyCheckAndFeeValidationErrorPopup = ({
    error,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>('confirm_checks')

    switch (state) {
        case 'confirm_checks':
            return (
                <SafetyChecksConfirmation
                    knownCurrencies={
                        error.safetyCheck.simulated.simulation.simulation
                            .currencies
                    }
                    failedSafetyChecks={error.safetyCheck.failedChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'safety_check_confirm_clicked':
                                setState('confirm_fees')
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'confirm_fees': {
            return (
                <FeeValidationConfirmationPopup
                    reason={error.forecastFeeError}
                    onMsg={onMsg}
                />
            )
        }

        default:
            return notReachable(state)
    }
}
