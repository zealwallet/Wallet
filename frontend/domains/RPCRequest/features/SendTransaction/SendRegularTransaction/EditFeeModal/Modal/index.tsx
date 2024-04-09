import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { BoldActivity } from '@zeal/uikit/Icon/BoldActivity'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { EditGasLimit } from './EditGasLimit'
import { EditNonce } from './EditNonce'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    state: State
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'pollable_params_changed'
          params: FeeForecastRequest
      }

export type State =
    | { type: 'closed' }
    | { type: 'edit_gas_limit' }
    | { type: 'edit_nonce' }
    | { type: 'max_fee' }

export const Modal = ({
    state,
    onMsg,
    pollableData,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    transactionRequest,
    keystoreMap,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'edit_gas_limit':
            return (
                <EditGasLimit
                    keyStoreMap={keystoreMap}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    onMsg={onMsg}
                    pollableData={pollableData}
                    simulateTransactionResponse={simulateTransactionResponse}
                    transactionRequest={transactionRequest}
                />
            )

        case 'edit_nonce':
            return (
                <EditNonce
                    keyStoreMap={keystoreMap}
                    currentNonce={nonce}
                    gasEstimate={gasEstimate}
                    onMsg={onMsg}
                    pollableData={pollableData}
                    simulateTransactionResponse={simulateTransactionResponse}
                    transactionRequest={transactionRequest}
                />
            )

        case 'max_fee':
            return (
                <Popup.Layout onMsg={onMsg} aria-labelledby="nonce-popup-title">
                    <Header
                        icon={({ color, size }) => (
                            <BoldActivity color={color} size={size} />
                        )}
                        title={
                            <FormattedMessage
                                id="EditFeeModal.MaxFee.title"
                                defaultMessage="Max Network Fee"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="EditFeeModal.MaxFee.subtitle"
                                defaultMessage="The Max fee is the most you'd pay for a transaction, but you'll usually pay the predicted fee. This extra buffer helps your transaction go through, even if the network slows down or becomes more expensive."
                            />
                        }
                    />
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
