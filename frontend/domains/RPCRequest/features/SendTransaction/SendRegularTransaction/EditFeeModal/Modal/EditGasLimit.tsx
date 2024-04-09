import { FormattedMessage } from 'react-intl'

import { Big } from 'big.js'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Input } from '@zeal/uikit/Input'
import { IntegerInput } from '@zeal/uikit/Input/IntegerInput'
import { Popup } from '@zeal/uikit/Popup'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { toHex } from '@zeal/toolkit/Number'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { CANCEL_GAS_AMOUNT } from '@zeal/domains/Transactions/constants'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import {
    EditFormCustomPresetValidationError,
    validateEditFormCustomPresetValidationError,
} from '../../FeeForecastWidget/helpers/validation'
import { getCustomFee } from '../../helpers/getCustomFee'
import { getNonce } from '../../helpers/getNonce'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    transactionRequest: NotSigned
    nonce: number
    gasEstimate: string
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'pollable_params_changed'
          params: FeeForecastRequest
      }
    | { type: 'close' }

export const EditGasLimit = ({
    onMsg,
    pollableData,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    transactionRequest,
    keyStoreMap,
}: Props) => {
    const keystore = getKeyStore({
        keyStoreMap,
        address: transactionRequest.account.address,
    })

    const validation =
        validateEditFormCustomPresetValidationError({
            pollableData,
            simulationResult: simulateTransactionResponse,
            nonce,
            gasEstimate,
            transactionRequest,
            keystore,
        }).getFailureReason() || {}
    const gasLimitError = validation.gasLimit

    const currentGasLimit = BigInt(pollableData.params.gasLimit).toString(10)
    const gasMultiplier = getGasMultiplier(gasEstimate, pollableData)

    const formData = getCustomFee(pollableData)

    const onSubmit = () => {
        onMsg({ type: 'close' })
    }

    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="gas-limit-popup-title">
            <Header
                titleId="gas-limit-popup-title"
                title={
                    <FormattedMessage
                        id="EditFeeModal.EditGasLimit.title"
                        defaultMessage="Edit gas limit"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="EditFeeModal.EditGasLimit.subtitle"
                        defaultMessage="Set the maximum amount of gas you’d want this transaction to use. Your transaction will fail if you set a limit lower than what it needs"
                    />
                }
            />
            <Popup.Content>
                <IntegerInput
                    integerString={currentGasLimit}
                    onChange={(newGasLimit) => {
                        onMsg({
                            type: 'pollable_params_changed',
                            params: {
                                ...pollableData.params,
                                gasLimit: toHex(newGasLimit),
                                selectedPreset: {
                                    type: 'Custom',
                                    fee: {
                                        ...formData.fee,
                                        nonce: getNonce(pollableData, nonce),
                                    },
                                },
                            },
                        })
                    }}
                >
                    {({ value, onChange }) => (
                        <Input
                            keyboardType="numeric"
                            variant="small"
                            placeholder="0"
                            state={gasLimitError ? 'error' : 'normal'}
                            message={
                                gasLimitError ? (
                                    <ErrorMessage error={gasLimitError} />
                                ) : (
                                    gasMultiplier && (
                                        <Text
                                            variant="caption1"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="EditFeeModal.EditGasLimit.estimatedGas"
                                                defaultMessage="Est gas: {estimated} • Safety buffer: {multiplier}x"
                                                values={{
                                                    multiplier:
                                                        gasMultiplier.multiplier,
                                                    estimated: BigInt(
                                                        gasMultiplier.estimated
                                                    ).toString(10),
                                                }}
                                            />
                                        </Text>
                                    )
                                )
                            }
                            sideMessage={
                                gasLimitError && (
                                    <Tertiary
                                        color="on_light"
                                        size="small"
                                        onClick={() => {
                                            onMsg({
                                                type: 'pollable_params_changed',
                                                params: {
                                                    ...pollableData.params,
                                                    gasLimit:
                                                        gasLimitError.suggestedGasLimit,
                                                },
                                            })
                                        }}
                                    >
                                        {({
                                            color,
                                            textVariant,
                                            textWeight,
                                        }) => (
                                            <Text
                                                color={color}
                                                variant={textVariant}
                                                weight={textWeight}
                                            >
                                                <FormattedMessage
                                                    id="actions.fix"
                                                    defaultMessage="Fix"
                                                />
                                            </Text>
                                        )}
                                    </Tertiary>
                                )
                            }
                            value={value}
                            onChange={onChange}
                            onSubmitEditing={onSubmit}
                        />
                    )}
                </IntegerInput>
            </Popup.Content>
            <Popup.Actions>
                <Button variant="primary" size="regular" onClick={onSubmit}>
                    <FormattedMessage id="actions.done" defaultMessage="Done" />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<EditFormCustomPresetValidationError['gasLimit']>
}) => {
    switch (error.type) {
        case 'trx_likely_to_fail':
            switch (error.reason) {
                case 'less_than_estimated_gas':
                    return (
                        <FormattedMessage
                            id="EditFeeModal.EditGasLimit.less_than_estimated_gas"
                            defaultMessage="Less than estimated limit. Transaction will fail"
                        />
                    )

                case 'less_than_suggested_gas':
                    return (
                        <FormattedMessage
                            id="EditFeeModal.EditGasLimit.less_than_suggested_gas"
                            defaultMessage="Less than suggested limit. Transaction could fail"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(error.reason)
            }

        case 'trx_will_fail_less_then_minimum_gas':
            return (
                <FormattedMessage
                    id="EditFeeModal.EditGasLimit.trx_will_fail_less_then_minimum_gas"
                    defaultMessage="Less than minimum gas limit: {minimumLimit}"
                    values={{
                        minimumLimit: BigInt(CANCEL_GAS_AMOUNT).toString(10),
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const getGasMultiplier = (
    gasEstimate: string,
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
): { multiplier: string; estimated: string } | null => {
    const current = Big(BigInt(pollableData.params.gasLimit).toString(10))
    return {
        estimated: gasEstimate,
        multiplier: current
            .div(Big(BigInt(gasEstimate).toString(10)))
            .toFixed(1),
    }
}
