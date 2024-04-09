import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { ListItem } from '@zeal/uikit/ListItem'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
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
          type: 'blind_sign_confirmation_modal'
          keyStore: SigningKeyStore
          simulated: Simulated
      }
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

        case 'blind_sign_confirmation_modal':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <ShieldFail
                                color="iconStatusCritical"
                                size={size}
                            />
                        )}
                        title={
                            <FormattedMessage
                                id="FailedSimulation.Confirmation.title"
                                defaultMessage="You are signing blind"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="FailedSimulation.Confirmation.subtitle"
                                defaultMessage="Are you sure you want to continue?"
                            />
                        }
                    />
                    <Popup.Content>
                        <ListItem
                            aria-current={false}
                            size="regular"
                            variant="critical"
                            primaryText={
                                <FormattedMessage
                                    id="FailedSimulation.Confirmation.Item.title"
                                    defaultMessage="Couldn’t simulate transaction"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="FailedSimulation.Confirmation.Item.subtitle"
                                    defaultMessage="We had an internal error"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ShieldFail
                                        color="iconStatusCritical"
                                        size={size}
                                    />
                                ),
                            }}
                        />
                    </Popup.Content>

                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button
                            size="regular"
                            variant="secondary"
                            onClick={() =>
                                onMsg({
                                    type: 'user_confirmed_transaction_for_signing',
                                    transactionRequest: state.simulated,
                                    keyStore: state.keyStore,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.submit"
                                defaultMessage="Submit"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
