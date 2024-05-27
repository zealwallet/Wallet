import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import * as Haptics from 'expo-haptics'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import {
    LazyLoadableData,
    useLazyLoadableData,
} from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { PIN_LENGTH, validatePin } from '@zeal/domains/Password'
import { decryptPassword } from '@zeal/domains/Password/helpers/decryptPassword'

import { BiometricButton } from './BiometricButton'

type Props = {
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type DecryptionLoadable = LazyLoadableData<
    { sessionPassword: string; unencryptedUserPassword: string },
    { userPassword: string; encrypted: string }
>

type Msg =
    | { type: 'session_password_decrypted'; sessionPassword: string }
    | { type: 'lock_screen_close_click' }

const PIN_CLEAR_TIMEOUT_MS = 1000

export const PinLockScreen = ({ encryptedPassword, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [pin, setPin] = useState<string>('')
    const [decryptLoadable, setDecryptLoadable] =
        useLazyLoadableData(decryptPassword)

    useEffect(() => {
        const validationResult = validatePin(pin)

        switch (validationResult.type) {
            case 'Failure':
                return
            case 'Success':
                setDecryptLoadable({
                    type: 'loading',
                    params: {
                        encrypted: encryptedPassword,
                        userPassword: validationResult.data,
                    },
                })
                return
            /* istanbul ignore next */
            default:
                return notReachable(validationResult)
        }
    }, [encryptedPassword, pin, setDecryptLoadable])

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (decryptLoadable.type) {
            case 'not_asked':
            case 'loading':
                return
            case 'error':
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                const timeout = setTimeout(() => {
                    setPin('')
                    setDecryptLoadable({ type: 'not_asked' })
                }, PIN_CLEAR_TIMEOUT_MS)

                return () => clearTimeout(timeout)
            case 'loaded':
                liveMsg.current({
                    type: 'session_password_decrypted',
                    sessionPassword: decryptLoadable.data.sessionPassword,
                })
                return
            /* istanbul ignore next */
            default:
                return notReachable(decryptLoadable)
        }
    }, [decryptLoadable, setDecryptLoadable, liveMsg])

    return (
        <Screen
            padding="pin"
            background="light"
            onNavigateBack={() => onMsg({ type: 'lock_screen_close_click' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                        onClick={() =>
                            onMsg({ type: 'lock_screen_close_click' })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <KeyPad.Layout
                keyPad={
                    <KeyPad
                        leftAction={
                            <BiometricButton
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'on_pin_retrieved':
                                            setPin(msg.savedPin)
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg.type)
                                    }
                                }}
                            />
                        }
                        disabled={pin.length === PIN_LENGTH}
                        rightAction={
                            <KeyPad.BackSpaceButton
                                aria-label={formatMessage({
                                    id: 'password.removeLastDigit',
                                    defaultMessage: 'Remove last digit',
                                })}
                                disabled={(() => {
                                    switch (decryptLoadable.type) {
                                        case 'not_asked':
                                        case 'loaded':
                                            return false
                                        case 'loading':
                                        case 'error':
                                            return true
                                        default:
                                            return notReachable(decryptLoadable)
                                    }
                                })()}
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
                            id="password.enter_pin"
                            defaultMessage="Enter PIN"
                        />
                    </Text>

                    <Steps
                        length={PIN_LENGTH}
                        progress={pin.length}
                        state={(() => {
                            switch (decryptLoadable.type) {
                                case 'not_asked':
                                case 'loading':
                                case 'loaded':
                                    return 'primary'
                                case 'error':
                                    return 'warning'
                                default:
                                    return notReachable(decryptLoadable)
                            }
                        })()}
                    />

                    <Subtitle decryptionLoadable={decryptLoadable} />
                </KeyPad.Content>
            </KeyPad.Layout>
        </Screen>
    )
}

const Subtitle = ({
    decryptionLoadable,
}: {
    decryptionLoadable: DecryptionLoadable
}) => (
    <Text variant="callout" color="textStatusWarning" weight="regular">
        {(() => {
            switch (decryptionLoadable.type) {
                case 'error':
                    return (
                        <FormattedMessage
                            id="password.incorrectPin"
                            defaultMessage="Incorrect PIN"
                        />
                    )

                case 'not_asked':
                case 'loading':
                case 'loaded':
                    return <>&nbsp;</>

                default:
                    return notReachable(decryptionLoadable)
            }
        })()}
    </Text>
)
