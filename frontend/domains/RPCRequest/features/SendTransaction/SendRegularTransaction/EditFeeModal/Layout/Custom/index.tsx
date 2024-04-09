import { FormattedMessage } from 'react-intl'

import { Collapsible } from '@zeal/uikit/Collapsible'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { Eip1559Form } from './Eip1559Form'
import { LegacyForm } from './LegacyForm'

import { validateEditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'
import { getCustomFee } from '../../../helpers/getCustomFee'
import { getNonce } from '../../../helpers/getNonce'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keyStoreMap: KeyStoreMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'pollable_params_changed'
          params: FeeForecastRequest
      }
    | { type: 'on_edit_nonce_click' }
    | { type: 'on_edit_gas_limit_click' }

export const Custom = ({
    transactionRequest,
    simulateTransactionResponse,
    pollableData,
    nonce,
    gasEstimate,
    keyStoreMap,
    onMsg,
}: Props) => {
    return (
        <Collapsible
            role="radio"
            title={
                <FormattedMessage
                    id="EditFeeModal.Custom.title"
                    defaultMessage="Advanced settings"
                />
            }
            initialState={
                pollableData.params.selectedPreset.type === 'Custom'
                    ? 'expanded'
                    : 'collapsed'
            }
            selected={pollableData.params.selectedPreset.type === 'Custom'}
        >
            <Content
                keyStoreMap={keyStoreMap}
                transactionRequest={transactionRequest}
                onMsg={onMsg}
                pollableData={pollableData}
                simulateTransactionResponse={simulateTransactionResponse}
                nonce={nonce}
                gasEstimate={gasEstimate}
            />
        </Collapsible>
    )
}

const Content = ({
    transactionRequest,
    simulateTransactionResponse,
    nonce: simulatedNonce,
    gasEstimate,
    pollableData,
    keyStoreMap,
    onMsg,
}: Props) => {
    const keystore = getKeyStore({
        keyStoreMap,
        address: transactionRequest.account.address,
    })
    const validationData =
        validateEditFormCustomPresetValidationError({
            pollableData,
            simulationResult: simulateTransactionResponse,
            transactionRequest,
            nonce: simulatedNonce,
            gasEstimate,
            keystore,
        }).getFailureReason() || {}

    const nonce = getNonce(pollableData, simulatedNonce)

    const formData = getCustomFee(pollableData)

    switch (formData.type) {
        case 'legacy':
            return (
                <LegacyForm
                    simulatedNonce={simulatedNonce}
                    fee={formData.fee}
                    gasLimit={pollableData.params.gasLimit}
                    nonce={nonce}
                    validationData={validationData}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_fix_nonce_click':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: msg.nonce,
                                            },
                                        },
                                    },
                                })
                                break
                            case 'on_fix_gas_limit':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        gasLimit: msg.gasLimit,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: getNonce(
                                                    pollableData,
                                                    simulatedNonce
                                                ),
                                            },
                                        },
                                    },
                                })
                                break
                            case 'on_gas_price_change':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                type: 'LegacyCustomPresetRequestFee',
                                                nonce: getNonce(
                                                    pollableData,
                                                    simulatedNonce
                                                ),
                                                gasPrice: msg.gasPrice,
                                            },
                                        },
                                    },
                                })
                                break

                            case 'on_edit_nonce_click':
                            case 'on_edit_gas_limit_click':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'eip1559':
            return (
                <Eip1559Form
                    simulatedNonce={simulatedNonce}
                    networkState={formData.networkState}
                    fee={formData.fee}
                    gasLimit={pollableData.params.gasLimit}
                    nonce={nonce}
                    validationData={validationData}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_fix_nonce_click':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: msg.nonce,
                                            },
                                        },
                                    },
                                })
                                break
                            case 'on_max_base_fee_change':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: getNonce(
                                                    pollableData,
                                                    simulatedNonce
                                                ),
                                                maxBaseFee: msg.maxBaseFee,
                                            },
                                        },
                                    },
                                })
                                break

                            case 'on_max_priority_fee_change':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: getNonce(
                                                    pollableData,
                                                    simulatedNonce
                                                ),
                                                maxPriorityFee:
                                                    msg.maxPriorityFee,
                                            },
                                        },
                                    },
                                })
                                break
                            case 'on_fix_gas_limit':
                                onMsg({
                                    type: 'pollable_params_changed',
                                    params: {
                                        ...pollableData.params,
                                        gasLimit: msg.gasLimit,
                                        selectedPreset: {
                                            type: 'Custom',
                                            fee: {
                                                ...formData.fee,
                                                nonce: getNonce(
                                                    pollableData,
                                                    simulatedNonce
                                                ),
                                            },
                                        },
                                    },
                                })
                                break

                            case 'on_edit_nonce_click':
                            case 'on_edit_gas_limit_click':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(formData)
    }
}
