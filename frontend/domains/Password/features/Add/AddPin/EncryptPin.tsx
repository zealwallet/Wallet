import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { KeyPad } from '@zeal/uikit/Keypad'
import { Screen } from '@zeal/uikit/Screen'
import { Steps } from '@zeal/uikit/Steps'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Pin, PIN_LENGTH } from '@zeal/domains/Password'
import { encryptPassword } from '@zeal/domains/Password/helpers/encryptPassword'

type Props = {
    pin: Pin
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'password_added'
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

export const EncryptPin = ({ onMsg, pin }: Props) => {
    const { formatMessage } = useIntl()
    const [loadable] = useLoadableData(encryptPin, {
        type: 'loading',
        params: { pin },
    })

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'error':
                captureError(loadable.error)
                break
            case 'loaded':
                liveMsg.current({
                    type: 'password_added',
                    pin: loadable.params.pin,
                    sessionPassword: loadable.data.sessionPassword,
                    encryptedPassword: loadable.data.encryptedPassword,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveMsg, loadable])

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
                        disabled
                        rightAction={null}
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
