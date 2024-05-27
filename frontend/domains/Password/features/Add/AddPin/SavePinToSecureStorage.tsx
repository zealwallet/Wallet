import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import * as storage from '@zeal/toolkit/Storage'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Pin, PIN_LENGTH } from '@zeal/domains/Password'
import { PIN_KEY } from '@zeal/domains/Storage/constants'

type Props = {
    pin: Pin
    sessionPassword: string
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'password_added'
    sessionPassword: string
    encryptedPassword: string
}

const save = async ({ pin }: { pin: Pin }): Promise<void> => {
    const primaryBiometricType =
        await storage.secure.fetchPrimaryBiometricType()

    switch (primaryBiometricType.type) {
        case 'not_available':
            return
        case 'available':
            return storage.secure.set({ key: PIN_KEY, value: pin })
        /* istanbul ignore next */
        default:
            return notReachable(primaryBiometricType)
    }
}

export const SavePinToSecureStorage = ({
    onMsg,
    pin,
    sessionPassword,
    encryptedPassword,
}: Props) => {
    const { formatMessage } = useIntl()
    const [loadable] = useLoadableData(save, {
        type: 'loading',
        params: { pin },
    })

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                liveMsg.current({
                    type: 'password_added',
                    sessionPassword,
                    encryptedPassword,
                })
                break
            case 'error':
                const parsed = parseAppError(loadable.error)
                switch (parsed.type) {
                    case 'biometric_prompt_cancelled':
                        break

                    default:
                        captureError(loadable.error)
                }

                liveMsg.current({
                    type: 'password_added',
                    sessionPassword,
                    encryptedPassword,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [encryptedPassword, liveMsg, loadable, sessionPassword])

    return (
        <Screen padding="pin" background="light" onNavigateBack={noop}>
            <ActionBar />

            <KeyPad.Layout
                keyPad={
                    <KeyPad
                        leftAction={null}
                        disabled
                        rightAction={
                            <KeyPad.BackSpaceButton
                                aria-label={formatMessage({
                                    id: 'password.removeLastDigit',
                                    defaultMessage: 'Remove last digit',
                                })}
                                disabled
                                onPress={noop}
                            />
                        }
                        onPress={noop}
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
                        progress={PIN_LENGTH}
                        state="primary"
                    />
                </KeyPad.Content>
            </KeyPad.Layout>
        </Screen>
    )
}
