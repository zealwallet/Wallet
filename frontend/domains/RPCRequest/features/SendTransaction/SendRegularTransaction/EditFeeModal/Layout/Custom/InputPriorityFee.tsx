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
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'
import { toHex } from '@zeal/toolkit/Number'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
    maxPriorityFee: string
    networkState: components['schemas']['Eip1559NetworkState'] | null
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_max_priority_fee_change'
    maxPriorityFee: string
}

export const InputPriorityFee = ({
    error,
    maxPriorityFee,
    networkState,
    onMsg,
}: Props) => {
    const [floatString, setFloatString] = useFloatInputFromLiveUpstream({
        value: Web3.utils.fromWei(maxPriorityFee, 'gwei'),
        update: (val) => {
            onMsg({
                type: 'on_max_priority_fee_change',
                maxPriorityFee: toHex(Web3.utils.toWei(val, 'gwei')),
            })
        },
        fractionDigits: 2,
    })

    return (
        <Column spacing={8} testID="priority-fee-input-container">
            <Text
                id="maxPriorityFeeInput"
                variant="footnote"
                weight="regular"
                color="textPrimary"
            >
                <FormattedMessage
                    id="EditFeeModa.Custom.Eip1559Form.maxPriorityFee.title"
                    defaultMessage="Priority Fee"
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
                        aria-labelledby="maxPriorityFeeInput"
                        variant="small"
                        placeholder="0"
                        rightIcon={
                            <Text
                                variant="caption1"
                                weight="regular"
                                color="textPrimary"
                            >
                                Gwei
                            </Text>
                        }
                        state={error ? 'error' : 'normal'}
                        message={
                            <Message
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

const NetworkStateMessage = ({
    networkState,
}: {
    networkState: components['schemas']['Eip1559NetworkState']
}) => {
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <FormattedMessage
            id="EditFeeModa.Custom.Eip1559Form.priorityFeeNetworkState"
            defaultMessage="Last {period}: between {from} and {to}"
            values={{
                period: formatHumanReadableDuration(networkState.durationMs),
                from: formatGWei(networkState.minPriorityFee),
                to: formatGWei(networkState.maxPriorityFee),
            }}
        />
    )
}

const SideMessage = ({
    error,
    onMsg,
}: {
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
    onMsg: (msg: Msg) => void
}) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'pollable_failed_to_fetch':
            return null
        case 'trx_may_take_long_to_proceed_priority_fee_low':
            return (
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() =>
                        onMsg({
                            type: 'on_max_priority_fee_change',
                            maxPriorityFee: error.suggestedPriorityFee,
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

const formatGWei = (hex: string) => {
    const gwei = Web3.utils.fromWei(hex, 'gwei')
    return Big(gwei).toFixed(2).replace(/\.00$/gi, '')
}

const Message = ({
    error,
    networkState,
}: {
    networkState: components['schemas']['Eip1559NetworkState'] | null
    error: NonNullable<
        EditFormCustomPresetValidationError['priorityFee']
    > | null
}) => {
    if (!error) {
        if (!networkState) {
            return null
        }

        return <NetworkStateMessage networkState={networkState} />
    }

    switch (error.type) {
        case 'trx_may_take_long_to_proceed_priority_fee_low':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.trx_may_take_long_to_proceed_priority_fee_low"
                    defaultMessage="Low fee. Might get stuck"
                />
            )

        case 'pollable_failed_to_fetch':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputPriorityFee.pollable_failed_to_fetch"
                    defaultMessage="We couldn’t calculate Priority Fee"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
