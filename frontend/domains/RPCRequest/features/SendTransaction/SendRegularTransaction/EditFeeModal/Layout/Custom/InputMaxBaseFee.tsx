import { FormattedMessage } from 'react-intl'

import { components } from '@zeal/api/portfolio'
import { Big } from 'big.js'
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
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
    networkState: components['schemas']['Eip1559NetworkState'] | null
    maxBaseFee: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_max_base_fee_change'
    maxBaseFee: string
}

export const InputMaxBaseFee = ({
    error,
    maxBaseFee,
    networkState,
    onMsg,
}: Props) => {
    const [floatString, setFloatString] = useFloatInputFromLiveUpstream({
        value: Web3.utils.fromWei(maxBaseFee, 'gwei'),
        update: (val) => {
            onMsg({
                type: 'on_max_base_fee_change',
                maxBaseFee: toHex(Web3.utils.toWei(val, 'gwei')),
            })
        },
        fractionDigits: 2,
    })

    return (
        <Column spacing={8} testID="max-base-fee-input-container">
            <Text
                id="maxBaseFeeInput"
                variant="footnote"
                weight="regular"
                color="textPrimary"
            >
                <FormattedMessage
                    id="EditFeeModa.Custom.LegacyForm.maxBaseFee.title"
                    defaultMessage="Max Base Fee"
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
                        aria-labelledby="maxBaseFeeInput"
                        variant="small"
                        placeholder="0"
                        state={error ? 'error' : 'normal'}
                        rightIcon={
                            <Text
                                variant="caption1"
                                weight="regular"
                                color="textPrimary"
                            >
                                Gwei
                            </Text>
                        }
                        message={
                            <Message
                                maxBaseFee={maxBaseFee}
                                networkState={networkState}
                                error={error}
                            />
                        }
                        sideMessage={
                            <SideMessage error={error} onMsg={onMsg} />
                        }
                        value={value}
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
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'pollable_failed_to_fetch':
            return null
        case 'trx_may_take_long_to_proceed_base_fee_low':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_max_base_fee_change',
                            maxBaseFee: error.suggestedMaxBaseFee,
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
    networkState,
    maxBaseFee,
}: {
    networkState: components['schemas']['Eip1559NetworkState'] | null
    error: NonNullable<EditFormCustomPresetValidationError['maxBaseFee']> | null
    maxBaseFee: string
}) => {
    if (!error) {
        if (!networkState) {
            return null
        }

        return (
            <NetworkState maxBaseFee={maxBaseFee} networkState={networkState} />
        )
    }

    switch (error.type) {
        case 'trx_may_take_long_to_proceed_base_fee_low':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.trx_may_take_long_to_proceed_base_fee_low"
                    defaultMessage="Will get stuck until Base Fee decreases"
                />
            )

        case 'pollable_failed_to_fetch':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputMaxBaseFee.pollable_failed_to_fetch"
                    defaultMessage="We couldn’t get current Base Fee"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

const NetworkState = ({
    maxBaseFee,
    networkState,
}: {
    maxBaseFee: string
    networkState: components['schemas']['Eip1559NetworkState']
}) => {
    const current = new Big(BigInt(maxBaseFee).toString(10))
    const network = new Big(BigInt(networkState.baseFee).toString(10))

    const buffer = current.div(network).toFixed(1)
    const currentFormatted = new Big(
        Web3.utils.fromWei(networkState.baseFee, 'gwei')
    )
        .toFixed(2)
        .replace(/\.00$/gi, '')

    return (
        <FormattedMessage
            id="EditFeeModal.Custom.InputMaxBaseFee.network_state_buffer"
            defaultMessage="Base Fee: {baseFee} • Safety buffer: {buffer}x"
            values={{
                buffer,
                baseFee: currentFormatted,
            }}
        />
    )
}
