import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { match, Result } from '@zeal/toolkit/Result'

import {
    Pin,
    PIN_LENGTH,
    validatePin,
    ValidatePinError,
} from '@zeal/domains/Password'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    createdPin: Pin
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'pin_confirmed'
          pin: Pin
      }

type NotSamePinError = { type: 'pin_is_not_same' }

const validateSamePin = ({
    createdPin,
    pin,
}: {
    pin: string
    createdPin: Pin
}): Result<NotSamePinError, Pin> =>
    match(pin, createdPin, { type: 'pin_is_not_same' as const })

const validate = ({
    createdPin,
    pin,
}: {
    pin: string
    createdPin: Pin
}): Result<NotSamePinError | ValidatePinError, Pin> =>
    validatePin(pin).andThen((pin) => validateSamePin({ createdPin, pin }))

const PIN_CLEAR_TIMEOUT_MS = 1000

export const ConfirmPin = ({ onMsg, createdPin, installationId }: Props) => {
    const { formatMessage } = useIntl()
    const [pin, setPin] = useState<string>('')

    const error = validate({ createdPin, pin }).getFailureReason() || null

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        const validationResult = validate({ createdPin, pin })

        switch (validationResult.type) {
            case 'Failure':
                switch (validationResult.reason.type) {
                    case 'wrong_pin_length':
                    case 'wrong_characters_in_pin':
                        return
                    case 'pin_is_not_same':
                        const timeout = setTimeout(
                            () => setPin(''),
                            PIN_CLEAR_TIMEOUT_MS
                        )
                        return () => clearTimeout(timeout)

                    default:
                        return notReachable(validationResult.reason)
                }

            case 'Success':
                postUserEvent({
                    type: 'PasswordConfirmedEvent',
                    installationId,
                })
                liveMsg.current({
                    type: 'pin_confirmed',
                    pin: validationResult.data,
                })
                return

            default:
                return notReachable(validationResult)
        }
    }, [pin, createdPin, liveMsg, installationId])

    return (
        <Screen
            padding="pin"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <KeyPad.Layout
                keyPad={
                    <KeyPad
                        leftAction={null}
                        disabled={pin.length === PIN_LENGTH}
                        rightAction={
                            <KeyPad.BackSpaceButton
                                aria-label={formatMessage({
                                    id: 'password.removeLastDigit',
                                    defaultMessage: 'Remove last digit',
                                })}
                                disabled={false}
                                onPress={() =>
                                    setPin((prev) =>
                                        prev.length === PIN_LENGTH
                                            ? ''
                                            : prev.slice(0, -1)
                                    )
                                }
                            />
                        }
                        onPress={(digit) =>
                            setPin((prev) =>
                                `${prev}${digit}`.substring(0, PIN_LENGTH)
                            )
                        }
                    />
                }
            >
                <KeyPad.Content>
                    <Text variant="title3" color="textPrimary" weight="medium">
                        <FormattedMessage
                            id="password.re_enter_pin"
                            defaultMessage="Re-enter PIN"
                        />
                    </Text>

                    <Steps
                        length={PIN_LENGTH}
                        progress={pin.length}
                        state={(() => {
                            if (!error) {
                                return 'primary'
                            }

                            switch (error.type) {
                                case 'wrong_pin_length':
                                case 'wrong_characters_in_pin':
                                    return 'primary'
                                case 'pin_is_not_same':
                                    return 'warning'
                                default:
                                    return notReachable(error)
                            }
                        })()}
                    />

                    <Text
                        variant="callout"
                        color="textStatusWarning"
                        weight="regular"
                    >
                        {(() => {
                            if (!error) {
                                return <>&nbsp;</>
                            }

                            switch (error.type) {
                                case 'wrong_pin_length':
                                case 'wrong_characters_in_pin':
                                    return <>&nbsp;</>
                                case 'pin_is_not_same':
                                    return (
                                        <FormattedMessage
                                            id="password.pin_is_not_same"
                                            defaultMessage="PIN doesn't match"
                                        />
                                    )
                                default:
                                    return notReachable(error)
                            }
                        })()}
                    </Text>
                </KeyPad.Content>
            </KeyPad.Layout>
        </Screen>
    )
}
