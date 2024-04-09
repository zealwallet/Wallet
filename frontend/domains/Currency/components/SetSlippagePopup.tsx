import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { Input } from '@zeal/uikit/Input'
import { FloatInput } from '@zeal/uikit/Input/FloatInput'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { SelectorButton } from '@zeal/uikit/SelectorButton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    numberString,
    RequiredError,
    Result,
    shape,
    StringValueNotNumberError,
} from '@zeal/toolkit/Result'

import { SWAP_SLIPPAGE_PERCENT_OPTIONS } from '@zeal/domains/Currency/domains/SwapQuote/constants'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

type Props = {
    slippagePercent: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_set_slippage_percent'; slippagePercent: number }
    | { type: 'close' }

type FormError = {
    submit?: StringValueNotNumberError | RequiredError | EmptyStringError
}

const validate = (input: string | null): Result<FormError, number> =>
    shape({
        submit: nonEmptyString(input).andThen(numberString),
    }).map(({ submit }) => submit)

export const SetSlippagePopup = ({ onMsg, slippagePercent }: Props) => {
    const { formatNumber } = useIntl()
    const { formatMessage } = useIntl()

    const [slippage, setSlippage] = useState<string | null>(
        SWAP_SLIPPAGE_PERCENT_OPTIONS.find(
            (preset) => Math.abs(slippagePercent - preset) < Number.EPSILON
        )
            ? null
            : formatNumber(slippagePercent, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
              })
    )

    const errors = validate(slippage).getFailureReason() || {}

    const onSubmit = () => {
        const result = validate(slippage)

        switch (result.type) {
            case 'Failure':
                captureError(new ImperativeError('This should not '))
                break

            case 'Success':
                onMsg({
                    type: 'on_set_slippage_percent',
                    slippagePercent: result.data,
                })
                break

            /* istanbul ignore next */
            default:
                notReachable(result)
        }
    }

    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="slippage-modal-label">
            <Header
                titleId="slippage-modal-label"
                title={
                    <FormattedMessage
                        id="SlippagePopup.title"
                        defaultMessage="Slippage settings"
                    />
                }
            />
            <Column spacing={12}>
                <Text
                    variant="paragraph"
                    color="textSecondary"
                    weight="regular"
                >
                    <FormattedMessage
                        id="SlippagePopup.presetsHeader"
                        defaultMessage="Swap slippage"
                    />
                </Text>

                <Row spacing={4}>
                    {SWAP_SLIPPAGE_PERCENT_OPTIONS.map((preset) => (
                        <SelectorButton
                            key={preset}
                            selected={
                                Math.abs(preset - slippagePercent) <
                                Number.EPSILON
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_set_slippage_percent',
                                    slippagePercent: preset,
                                })
                            }
                        >
                            {formatNumber(preset / 100, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 0,
                                style: 'percent',
                            })}
                        </SelectorButton>
                    ))}
                </Row>

                <Column spacing={12}>
                    <Row spacing={0}>
                        <FloatInput
                            prefix=""
                            value={slippage}
                            fraction={2}
                            onChange={setSlippage}
                        >
                            {({ value, onChange }) => (
                                <Input
                                    keyboardType="numeric"
                                    onSubmitEditing={onSubmit}
                                    onChange={onChange}
                                    state="normal"
                                    placeholder={formatMessage({
                                        id: 'SlippagePopup.custom',
                                        defaultMessage: 'Custom',
                                    })}
                                    variant="regular"
                                    value={value}
                                />
                            )}
                        </FloatInput>
                    </Row>

                    <Popup.Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            disabled={!!errors.submit}
                            onClick={onSubmit}
                        >
                            <FormattedMessage
                                id="action.save"
                                defaultMessage="Save"
                            />
                        </Button>
                    </Popup.Actions>
                </Column>
            </Column>
        </Popup.Layout>
    )
}
