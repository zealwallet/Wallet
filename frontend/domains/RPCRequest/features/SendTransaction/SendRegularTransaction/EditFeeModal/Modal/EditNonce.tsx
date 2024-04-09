import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Input } from '@zeal/uikit/Input'
import { IntegerInput } from '@zeal/uikit/Input/IntegerInput'
import { Popup } from '@zeal/uikit/Popup'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

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

import {
    EditFormCustomPresetValidationError,
    validateEditFormCustomPresetValidationError,
} from '../../FeeForecastWidget/helpers/validation'
import { getCustomFee } from '../../helpers/getCustomFee'
import { getNonce } from '../../helpers/getNonce'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    simulateTransactionResponse: SimulationResult
    gasEstimate: string
    currentNonce: number
    transactionRequest: NotSigned
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'pollable_params_changed'
          params: FeeForecastRequest
      }
    | { type: 'close' }

export const EditNonce = ({
    onMsg,
    pollableData,
    simulateTransactionResponse,
    currentNonce,
    gasEstimate,
    transactionRequest,
    keyStoreMap,
}: Props) => {
    const nonce = getNonce(pollableData, currentNonce)
    const keystore = getKeyStore({
        keyStoreMap: keyStoreMap,
        address: transactionRequest.account.address,
    })

    const validation =
        validateEditFormCustomPresetValidationError({
            pollableData,
            simulationResult: simulateTransactionResponse,
            nonce: currentNonce,
            transactionRequest,
            gasEstimate,
            keystore,
        }).getFailureReason() || {}

    const formData = getCustomFee(pollableData)
    const onChangeCallback = (newValue: string) => {
        const newNonce = Number(newValue)

        onMsg({
            type: 'pollable_params_changed',
            params: {
                ...pollableData.params,
                selectedPreset: {
                    type: 'Custom',
                    fee: {
                        ...formData.fee,
                        nonce: newNonce,
                    },
                },
            },
        })
    }

    const onSubmit = () => {
        onMsg({ type: 'close' })
    }

    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="nonce-popup-title">
            <Header
                title={
                    <FormattedMessage
                        id="EditFeeModal.EditNonce.title"
                        defaultMessage="Edit nonce"
                    />
                }
                titleId="nonce-popup-title"
                subtitle={
                    <FormattedMessage
                        id="EditFeeModal.EditNonce.subtitle"
                        defaultMessage="Your transaction will get stuck if you set other than the next nonce"
                    />
                }
            />
            <Popup.Content>
                <Column spacing={8}>
                    <Text
                        variant="footnote"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="EditFeeModal.EditNonce.inputLabel"
                            defaultMessage="Nonce"
                        />
                    </Text>
                    <IntegerInput
                        integerString={nonce.toString(10)}
                        onChange={onChangeCallback}
                    >
                        {({ onChange, value }) => (
                            <Input
                                keyboardType="number-pad"
                                variant="small"
                                placeholder={nonce.toString(10)}
                                state={validation.nonce ? 'error' : 'normal'}
                                value={value}
                                onChange={onChange}
                                onSubmitEditing={onSubmit}
                                sideMessage={
                                    validation.nonce && (
                                        <Tertiary
                                            color="on_light"
                                            size="small"
                                            onClick={() => {
                                                onChangeCallback(
                                                    currentNonce.toString(10)
                                                )
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
                                message={
                                    validation.nonce && (
                                        <ErrorMessage
                                            error={validation.nonce}
                                        />
                                    )
                                }
                            />
                        )}
                    </IntegerInput>
                </Column>
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
    error: NonNullable<EditFormCustomPresetValidationError['nonce']>
}) => {
    switch (error.type) {
        case 'nonce_range_error_less_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.EditNonce.less_than_current"
                    defaultMessage="Can’t set nonce lower than current nonce"
                />
            )
        case 'nonce_range_error_bigger_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.EditNonce.bigger_than_current"
                    defaultMessage="Higher than next Nonce. Will get stuck"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
