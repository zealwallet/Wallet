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

import { Pin, PIN_LENGTH, validatePin } from '@zeal/domains/Password'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'pin_created'; pin: Pin }

export const CreatePin = ({ onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [pin, setPin] = useState<string>('')

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        const validationResult = validatePin(pin)

        switch (validationResult.type) {
            case 'Failure':
                break
            case 'Success':
                liveMsg.current({
                    type: 'pin_created',
                    pin: validationResult.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(validationResult)
        }
    }, [liveMsg, pin])

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
                                    setPin((prev) => prev.slice(0, -1))
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
                            id="password.create_pin"
                            defaultMessage="Create PIN"
                        />
                    </Text>

                    <Steps
                        length={PIN_LENGTH}
                        progress={pin.length}
                        state="primary"
                    />

                    <Text
                        variant="callout"
                        color="textStatusWarning"
                        weight="regular"
                    >
                        &nbsp;
                    </Text>
                </KeyPad.Content>
            </KeyPad.Layout>
        </Screen>
    )
}
