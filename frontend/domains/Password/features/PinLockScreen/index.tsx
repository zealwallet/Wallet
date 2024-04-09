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

export const PinLockScreen = ({ encryptedPassword, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [pin, setPin] = useState<string>('')
    const [decryptLoadable, setDecryptLoadable] =
        useLazyLoadableData(decryptPassword)

    useEffect(() => {
        const validationResult = validatePin(pin)

        switch (validationResult.type) {
            case 'Failure':
                break
            case 'Success':
                setDecryptLoadable({
                    type: 'loading',
                    params: {
                        encrypted: encryptedPassword,
                        userPassword: validationResult.data,
                    },
                })
                break
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
                break
            case 'error':
                setPin('')
                break
            case 'loaded':
                liveMsg.current({
                    type: 'session_password_decrypted',
                    sessionPassword: decryptLoadable.data.sessionPassword,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(decryptLoadable)
        }
    }, [decryptLoadable, liveMsg])

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
                        onClick={() =>
                            onMsg({ type: 'lock_screen_close_click' })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={32} alignX="center" alignY="center" fill>
                <Text variant="title3" color="textPrimary" weight="medium">
                    <FormattedMessage
                        id="password.enter_pin"
                        defaultMessage="Enter PIN"
                    />
                </Text>

                <Steps
                    length={PIN_LENGTH}
                    progress={pin.length}
                    state="primary"
                />

                <Subtitle decryptionLoadable={decryptLoadable} />
            </Column>

            {/*FIXME @Nicvaniek BiometricButton makes the leftAction jump in KeyPad due to conditional null */}
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
