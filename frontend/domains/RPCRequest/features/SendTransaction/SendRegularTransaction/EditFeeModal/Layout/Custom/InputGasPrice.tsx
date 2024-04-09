import { FormattedMessage } from 'react-intl'

import Web3 from 'web3'

import { Column } from '@zeal/uikit/Column'
import { Input } from '@zeal/uikit/Input'
import {
    FloatInput,
    useFloatInputFromLiveUpstream,
} from '@zeal/uikit/Input/FloatInput'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { toHex } from '@zeal/toolkit/Number'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    error: NonNullable<EditFormCustomPresetValidationError['gasPrice']> | null
    gasPrice: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_gas_price_change'
    gasPrice: string
}

export const InputGasPrice = ({ error, gasPrice, onMsg }: Props) => {
    const [floatString, setFloatString] = useFloatInputFromLiveUpstream({
        value: Web3.utils.fromWei(gasPrice, 'gwei'),
        update: (val) => {
            onMsg({
                type: 'on_gas_price_change',
                gasPrice: toHex(Web3.utils.toWei(val, 'gwei')),
            })
        },
        fractionDigits: 2,
    })

    return (
        <Column spacing={8} testID="max-fee-input-container">
            <Text
                id="gas-price-label"
                variant="footnote"
                weight="regular"
                color="textPrimary"
            >
                <FormattedMessage
                    id="EditFeeModa.Custom.LegacyForm.gasPrice.title"
                    defaultMessage="Max Fee"
                />
            </Text>

            <FloatInput
                prefix=""
                value={floatString}
                fraction={2}
                onChange={setFloatString}
            >
                {({ onChange, value }) => (
                    <Input
                        keyboardType="numeric"
                        aria-labelledby="gas-price-label"
                        variant="small"
                        placeholder="0"
                        state={error ? 'error' : 'normal'}
                        message={<Message error={error} />}
                        value={value}
                        sideMessage={
                            <SideMessage error={error} onMsg={onMsg} />
                        }
                        rightIcon={
                            <Text
                                variant="caption1"
                                weight="regular"
                                color="textPrimary"
                            >
                                Gwei
                            </Text>
                        }
                        onChange={onChange}
                        onSubmitEditing={noop}
                    />
                )}
            </FloatInput>
        </Column>
    )
}

const SideMessage = ({
    error,
    onMsg,
}: {
    onMsg: (msg: Msg) => void
    error: NonNullable<EditFormCustomPresetValidationError['gasPrice']> | null
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'pollable_failed_to_fetch':
            return null
        case 'trx_may_take_long_to_proceed_gas_price_low':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_gas_price_change',
                            gasPrice: error.suggestedGasPrice,
                        })
                    }
                >
                    {({ color, textVariant, textWeight }) => (
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
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const Message = ({
    error,
}: {
    error: NonNullable<EditFormCustomPresetValidationError['gasPrice']> | null
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'trx_may_take_long_to_proceed_gas_price_low':
            return (
                <FormattedMessage
                    id="EditFeeModa.Custom.LegacyForm.gasPrice.trx_may_take_long_to_proceed_gas_price_low"
                    defaultMessage="Might get stuck until network fees decrease"
                />
            )

        case 'pollable_failed_to_fetch':
            return (
                <FormattedMessage
                    id="EditFeeModa.Custom.LegacyForm.gasPrice.pollable_failed_to_fetch"
                    defaultMessage="We couldn’t get current Max fee"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
