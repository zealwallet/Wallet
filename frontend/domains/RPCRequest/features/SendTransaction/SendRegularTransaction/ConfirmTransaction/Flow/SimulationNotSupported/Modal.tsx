import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { EditFeeModal } from '../../../EditFeeModal'
import {
    NonceRangeErrorBiggerThanCurrent,
    TrxLikelyToFail,
    TrxMayTakeLongToProceedBaseFeeLow,
    TrxMayTakeLongToProceedGasPriceLow,
    TrxMayTakeLongToProceedPriorityFeeLow,
} from '../../../FeeForecastWidget/helpers/validation'
import { FeeValidationConfirmationPopup } from '../../../FeeValidationConfirmationPopup'

type Props = {
    state: State

    pollable: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    pollingStartedAt: number
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystoreMap: KeyStoreMap

    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'edit_fee_modal' }
    | {
          type: 'fee_validation_confirmation_modal'
          reason:
              | TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
              | TrxMayTakeLongToProceedGasPriceLow<SigningKeyStore>
              | TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
              | TrxLikelyToFail<SigningKeyStore>
              | NonceRangeErrorBiggerThanCurrent<SigningKeyStore>
      }

type Msg =
    | MsgOf<typeof EditFeeModal>
    | MsgOf<typeof FeeValidationConfirmationPopup>

export const Modal = ({
    state,
    nonce,
    gasEstimate,
    pollable,
    pollingInterval,
    pollingStartedAt,
    simulateTransactionResponse,
    transactionRequest,
    keystoreMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'edit_fee_modal':
            return (
                <UIModal>
                    <EditFeeModal
                        keystoreMap={keystoreMap}
                        pollable={pollable}
                        pollingInterval={pollingInterval}
                        pollingStartedAt={pollingStartedAt}
                        simulateTransactionResponse={
                            simulateTransactionResponse
                        }
                        transactionRequest={transactionRequest}
                        nonce={nonce}
                        gasEstimate={gasEstimate}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'fee_validation_confirmation_modal':
            return (
                <FeeValidationConfirmationPopup
                    reason={state.reason}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
