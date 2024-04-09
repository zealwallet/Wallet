import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { set } from '@zeal/toolkit/Storage/secureStorage'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
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

export const SavePinToSecureStorage = ({
    onMsg,
    pin,
    sessionPassword,
    encryptedPassword,
}: Props) => {
    const { formatMessage } = useIntl()
    const [loadable] = useLoadableData(set, {
        type: 'loading',
        params: { key: PIN_KEY, value: pin },
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
                captureError(loadable.error)
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
        <Screen padding="pin" background="light">
            <ActionBar />

            <Column spacing={32} alignX="center" alignY="center" fill>
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
            </Column>

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
        </Screen>
    )
}
