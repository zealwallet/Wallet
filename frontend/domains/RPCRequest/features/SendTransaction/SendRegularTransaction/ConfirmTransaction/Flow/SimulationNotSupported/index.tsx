import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NotSigned, Simulated } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
    FeePresetMap,
    fetchFeeForecast,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { getDefaultFeePreset } from '@zeal/domains/Transactions/helpers/getDefaultFeePreset'
import { getSuggestedGasLimit } from '@zeal/domains/Transactions/helpers/getSuggestedGasLimit'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    nonce: number
    transactionRequest: NotSigned
    keystoreMap: KeyStoreMap
    gasEstimate: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_transaction_simulation_retry_clicked' }
    | { type: 'on_retry_button_clicked' }
    | { type: 'on_cancel_confirm_transaction_clicked' }
    | { type: 'on_minimize_click' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_minimize_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_predefined_fee_preset_selected' }
      >

const POLLING_INTERVAL_MS = 5000

export const SimulationNotSupported = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    keystoreMap,
    nonce,
    gasEstimate,
    feePresetMap,
    actionSource,
    onMsg,
}: Props) => {
    const [forecastFeePollable, setForecastFeePollable] = usePollableData<
        FeeForecastResponse,
        FeeForecastRequest
    >(
        fetchFeeForecast,
        {
            type: 'loading',
            params: {
                gasEstimate,
                address: transactionRequest.account.address,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
                gasLimit: getSuggestedGasLimit(gasEstimate),
                selectedPreset: getDefaultFeePreset({
                    feePresetMap,
                    networkHexId: transactionRequest.networkHexId,
                }),
                sendTransactionRequest: transactionRequest.rpcRequest,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: POLLING_INTERVAL_MS,
        }
    )

    const [pollingStartedAt, setPollingStartedAt] = useState<number>(Date.now)

    useEffect(() => {
        setPollingStartedAt(Date.now())
    }, [forecastFeePollable])

    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Modal
                keystoreMap={keystoreMap}
                nonce={nonce}
                gasEstimate={gasEstimate}
                pollable={forecastFeePollable}
                pollingInterval={POLLING_INTERVAL_MS}
                pollingStartedAt={pollingStartedAt}
                simulateTransactionResponse={{ type: 'failed' }}
                transactionRequest={transactionRequest}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'pollable_params_changed':
                            setForecastFeePollable({
                                ...forecastFeePollable,
                                params: msg.params,
                            })
                            break

                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'user_confirmed_transaction_for_signing':
                            onMsg(msg)
                            break

                        case 'on_predefined_fee_preset_selected':
                            setForecastFeePollable({
                                ...forecastFeePollable,
                                params: {
                                    ...forecastFeePollable.params,
                                    selectedPreset: msg.preset,
                                },
                            })
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />

            <Layout
                networkMap={networkMap}
                gasEstimate={gasEstimate}
                keyStoreMap={keystoreMap}
                nonce={nonce}
                pollable={forecastFeePollable}
                pollingStartedAt={pollingStartedAt}
                pollingInterval={POLLING_INTERVAL_MS}
                transactionRequest={transactionRequest}
                actionSource={actionSource}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_cancel_confirm_transaction_clicked':
                        case 'on_minimize_click':
                        case 'import_keys_button_clicked':
                            onMsg(msg)
                            break

                        case 'on_forecast_fee_click':
                            setModal({ type: 'edit_fee_modal' })
                            break

                        case 'on_forecast_fee_error_reload_click':
                            setForecastFeePollable({
                                type: 'loading',
                                params: forecastFeePollable.params,
                            })
                            break

                        case 'on_forecast_subsequent_failed_reload_click':
                            setForecastFeePollable({
                                type: 'reloading',
                                data: msg.data,
                                params: forecastFeePollable.params,
                            })
                            break

                        case 'continue_button_clicked':
                            onMsg({
                                type: 'user_confirmed_transaction_for_signing',
                                transactionRequest: msg.simulated,
                                keyStore: msg.keyStore,
                            })
                            break

                        case 'user_confirmation_requested':
                            setModal({
                                type: 'fee_validation_confirmation_modal',
                                reason: msg.reason,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
