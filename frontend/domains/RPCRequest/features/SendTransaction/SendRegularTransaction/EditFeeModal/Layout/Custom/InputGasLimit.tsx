import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { CANCEL_GAS_AMOUNT } from '@zeal/domains/Transactions/constants'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    gasLimit: string
    error: NonNullable<EditFormCustomPresetValidationError['gasLimit']> | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_edit_gas_limit_click' }
    | { type: 'on_fix_gas_limit'; gasLimit: string }

export const InputGasLimit = ({ error, gasLimit, onMsg }: Props) => {
    return (
        <Column spacing={8} testID="gas-limit-input-container">
            <Row spacing={4}>
                <Text variant="footnote" weight="regular" color="textSecondary">
                    <FormattedMessage
                        id="EditFeeModal.Custom.gasLimit.title"
                        defaultMessage="Gas Limit {gasLimit}"
                        values={{
                            gasLimit: BigInt(gasLimit).toString(10),
                        }}
                    />
                </Text>
                <Spacer />
                <Tertiary
                    color="on_light"
                    size="small"
                    onClick={() => onMsg({ type: 'on_edit_gas_limit_click' })}
                >
                    {({ color, textVariant, textWeight }) => (
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="actions.edit"
                                defaultMessage="edit"
                            />
                        </Text>
                    )}
                </Tertiary>
            </Row>

            {error && (
                <Row spacing={8}>
                    <Text color="textError" variant="caption1" weight="regular">
                        <ErrorMessage error={error} />
                    </Text>
                    <Spacer />
                    <Tertiary
                        color="on_light"
                        size="small"
                        onClick={() =>
                            onMsg({
                                type: 'on_fix_gas_limit',
                                gasLimit: error.suggestedGasLimit,
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
                </Row>
            )}
        </Column>
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
