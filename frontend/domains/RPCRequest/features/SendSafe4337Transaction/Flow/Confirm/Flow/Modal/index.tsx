import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { Result } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Network } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FailedTransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SimulatedUserOperationRequest } from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { GasAbstractionTransactionFee } from '@zeal/domains/UserOperation'

import { GasCurrencySelector } from './GasCurrencySelector'
import { SafetyChecksPopup } from './SafetyChecksPopup'
import { UserConfirmationPopup } from './UserConfirmationPopup'

import { FeeForecastError } from '../validation'

type Props = {
    account: Account
    network: Network
    state: State
    pollingInterval: number
    pollingStartedAt: number
    feeForecast: GasAbstractionTransactionFee[]
    userOperationRequest: SimulatedUserOperationRequest
    simulation: SimulateTransactionResponse
    portfolio: Portfolio | null
    feeForecastValidation: Result<
        FeeForecastError,
        GasAbstractionTransactionFee
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | MsgOf<typeof GasCurrencySelector>
    | MsgOf<typeof UserConfirmationPopup>

export type State =
    | { type: 'closed' }
    | { type: 'gas_currency_selector' }
    | {
          type: 'safety_checks_popup'
          simulation: SimulateTransactionResponse
      }
    | {
          type: 'user_confirmation'
          failedSafetyChecks: FailedTransactionSafetyCheck[]
          knownCurrencies: KnownCurrencies
          selectedFee: GasAbstractionTransactionFee
      }

export const Modal = ({
    state,
    onMsg,
    userOperationRequest,
    simulation,
    feeForecast,
    pollingStartedAt,
    pollingInterval,
    portfolio,
    account,
    feeForecastValidation,
    network,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'user_confirmation':
            return (
                <UserConfirmationPopup
                    simulation={simulation}
                    feeForecast={feeForecast}
                    selectedFee={state.selectedFee}
                    failedSafetyChecks={state.failedSafetyChecks}
                    knownCurrencies={state.knownCurrencies}
                    userOperationRequest={userOperationRequest}
                    onMsg={onMsg}
                />
            )
        case 'safety_checks_popup':
            return (
                <SafetyChecksPopup
                    simulation={state.simulation}
                    onMsg={onMsg}
                />
            )
        case 'gas_currency_selector':
            return (
                <UIModal>
                    <GasCurrencySelector
                        pollingStartedAt={pollingStartedAt}
                        pollingInterval={pollingInterval}
                        feeForecastValidation={feeForecastValidation}
                        account={account}
                        network={network}
                        feeForecast={feeForecast}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
