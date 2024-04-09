import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { SignMessageSimulationResponse } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { FailedSignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'

import { EditingLockedPopup } from './EditingLockedPopup'
import { ExpirationInfoPopup } from './ExpirationInfoPopup'
import { HighExpirationInfo } from './HighExpirationInfo'
import { HighSpendLimitInfo } from './HighSpendLimitInfo'
import { PermitInfoPopup } from './PermitInfoPopup'
import { SafetyCheckPopup } from './SafetyChecksPopup'
import { SpendLimitInfoPopup } from './SpendLimitInfoPopup'
import { UserConfirmationPopup } from './UserConfirmationPopup'

type Props = {
    state: State
    simulationResponse: SignMessageSimulationResponse
    request: SignMessageRequest
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SafetyCheckPopup> | MsgOf<typeof UserConfirmationPopup>

export type State =
    | { type: 'closed' }
    | { type: 'permit_info' }
    | { type: 'spend_limit_info' }
    | { type: 'expiration_info' }
    | { type: 'safety_checks_popup' }
    | { type: 'high_spend_limit_warning' }
    | { type: 'high_expiration_warning' }
    | { type: 'editing_locked_popup' }
    | {
          type: 'user_confirmation'
          failedSafetyChecks: FailedSignMessageSafetyCheck[]
          keyStore: SigningKeyStore
      }

export const Modal = ({
    state,
    simulationResponse,
    request,
    isLoading,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'safety_checks_popup':
            return (
                <SafetyCheckPopup
                    onMsg={onMsg}
                    simulationResponse={simulationResponse}
                />
            )

        case 'permit_info':
            return <PermitInfoPopup onMsg={onMsg} />

        case 'spend_limit_info':
            return <SpendLimitInfoPopup onMsg={onMsg} />

        case 'expiration_info':
            return <ExpirationInfoPopup onMsg={onMsg} />

        case 'user_confirmation':
            return (
                <UserConfirmationPopup
                    request={request}
                    failedSafetyChecks={state.failedSafetyChecks}
                    keyStore={state.keyStore}
                    isLoading={isLoading}
                    knownCurrencies={simulationResponse.currencies}
                    onMsg={onMsg}
                />
            )
        case 'high_spend_limit_warning':
            return <HighSpendLimitInfo onMsg={onMsg} />
        case 'high_expiration_warning':
            return <HighExpirationInfo onMsg={onMsg} />

        case 'editing_locked_popup':
            return <EditingLockedPopup onMsg={onMsg} />

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
