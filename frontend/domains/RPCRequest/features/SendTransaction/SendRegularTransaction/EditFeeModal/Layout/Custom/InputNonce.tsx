import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { EditFormCustomPresetValidationError } from '../../../FeeForecastWidget/helpers/validation'

type Props = {
    nonce: number
    simulatedNonce: number
    error: NonNullable<EditFormCustomPresetValidationError['nonce']> | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_edit_nonce_click' }
    | { type: 'on_fix_nonce_click'; nonce: number }

export const InputNonce = ({ nonce, simulatedNonce, error, onMsg }: Props) => (
    <Column spacing={8} testID="nonce-input-container">
        <Row spacing={4}>
            <Text variant="footnote" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.nonce"
                    defaultMessage="Nonce {nonce}"
                    values={{ nonce }}
                />
            </Text>

            <Spacer />

            <Tertiary
                color="on_light"
                size="small"
                onClick={() => onMsg({ type: 'on_edit_nonce_click' })}
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
                            type: 'on_fix_nonce_click',
                            nonce: simulatedNonce,
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

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<EditFormCustomPresetValidationError['nonce']>
}) => {
    switch (error.type) {
        case 'nonce_range_error_bigger_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.bigger_than_current"
                    defaultMessage="Higher than next Nonce. Will get stuck"
                />
            )
        case 'nonce_range_error_less_than_current':
            return (
                <FormattedMessage
                    id="EditFeeModal.Custom.InputNonce.less_than_current"
                    defaultMessage="Can’t set nonce lower than current nonce"
                />
            )

        default:
            return notReachable(error)
    }
}
