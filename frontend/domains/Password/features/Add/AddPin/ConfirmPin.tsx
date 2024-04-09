import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { match, Result } from '@zeal/toolkit/Result'

import {
    Pin,
    PIN_LENGTH,
    validatePin,
    ValidatePinError,
} from '@zeal/domains/Password'
import { encryptPassword } from '@zeal/domains/Password/helpers/encryptPassword'

type Props = {
    createdPin: Pin
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'pin_confirmed'
          pin: Pin
          sessionPassword: string
          encryptedPassword: string
      }

const encryptPin = ({
    pin,
}: {
    pin: Pin
}): Promise<{
    sessionPassword: string
    encryptedPassword: string
}> => encryptPassword({ password: pin })

const validate = ({
    createdPin,
    input,
}: {
    input: string
    createdPin: Pin
}): Result<{ type: 'pin_is_not_same' } | ValidatePinError, Pin> =>
    validatePin(input).andThen((pin) =>
        match(pin, createdPin, { type: 'pin_is_not_same' })
    )

export const ConfirmPin = ({ onMsg, createdPin }: Props) => {
    const { formatMessage } = useIntl()
    const [pin, setPin] = useState<string>('')
    const [loadable, setLoadable] = useLazyLoadableData(encryptPin)

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        const validationResult = validate({ createdPin, input: pin })

        switch (validationResult.type) {
            case 'Failure':
                break
            case 'Success':
                setLoadable({
                    type: 'loading',
                    params: { pin: validationResult.data },
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(validationResult)
        }
    }, [createdPin, liveMsg, pin, setLoadable])

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveMsg.current({
                    type: 'pin_confirmed',
                    pin: loadable.params.pin,
                    sessionPassword: loadable.data.sessionPassword,
                    encryptedPassword: loadable.data.encryptedPassword,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [createdPin, liveMsg, loadable])

    return (
        <Screen padding="pin" background="light">
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

            <Column spacing={32} alignX="center" alignY="center" fill>
                <Text variant="title3" color="textPrimary" weight="medium">
                    <FormattedMessage
                        id="password.re_enter_pin"
                        defaultMessage="Re-enter PIN"
                    />
                </Text>

                <Steps
                    length={PIN_LENGTH}
                    progress={pin.length}
                    state="primary"
                />

                {/* FIXME @resetko-zeal how to render validation? Spilled during IP */}
            </Column>

            <KeyPad
                leftAction={null}
                disabled={false}
                rightAction={
                    <KeyPad.BackSpaceButton
                        aria-label={formatMessage({
                            id: 'password.removeLastDigit',
                            defaultMessage: 'Remove last digit',
                        })}
                        disabled={false}
                        onPress={() => setPin((prev) => prev.slice(0, -1))}
                    />
                }
                onPress={(digit) =>
                    setPin((prev) => `${prev}${digit}`.substring(0, PIN_LENGTH))
                }
            />
        </Screen>
    )
}
