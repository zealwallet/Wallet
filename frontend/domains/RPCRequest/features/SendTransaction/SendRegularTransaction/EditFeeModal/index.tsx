import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { Layout, Msg as LayoutMsg } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

type Props = {
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

export type Msg =
    | { type: 'close' }
    | Extract<ModalMsg, { type: 'pollable_params_changed' }>
    | Extract<
          LayoutMsg,
          {
              type:
                  | 'pollable_params_changed'
                  | 'on_predefined_fee_preset_selected'
          }
      >

export const EditFeeModal = ({
    pollable,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    transactionRequest,
    pollingInterval,
    pollingStartedAt,
    keystoreMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                keystoreMap={keystoreMap}
                nonce={nonce}
                gasEstimate={gasEstimate}
                pollingStartedAt={pollingStartedAt}
                pollableData={pollable}
                simulateTransactionResponse={simulateTransactionResponse}
                transactionRequest={transactionRequest}
                pollingInterval={pollingInterval}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'pollable_params_changed':
                        case 'on_predefined_fee_preset_selected':
                            onMsg(msg)
                            break

                        case 'on_edit_gas_limit_click':
                            setState({ type: 'edit_gas_limit' })
                            break

                        case 'on_edit_nonce_click':
                            setState({ type: 'edit_nonce' })
                            break

                        case 'on_max_fee_info_icon_click':
                            setState({ type: 'max_fee' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                keystoreMap={keystoreMap}
                nonce={nonce}
                gasEstimate={gasEstimate}
                state={state}
                transactionRequest={transactionRequest}
                simulateTransactionResponse={simulateTransactionResponse}
                pollableData={pollable}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'pollable_params_changed':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
