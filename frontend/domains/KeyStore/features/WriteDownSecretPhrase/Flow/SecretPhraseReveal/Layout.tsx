import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { BlurCurtain } from '@zeal/uikit/BlurCurtain'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { Shield } from '@zeal/uikit/Icon/Shield'
import { IconButton } from '@zeal/uikit/IconButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import {
    getDescendantsFromString,
    SecretPhraseInput,
} from '@zeal/uikit/SecretPhraseInput'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { CopyPhraseButton } from '@zeal/domains/KeyStore/components/CopyPhraseButton'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'

type Props = {
    keystore: SecretPhrase
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_skip_verification_confirmation_click' }
    | { type: 'on_continue_to_verificaiton_click'; decryptedPhrase: string }
    | { type: 'on_secret_phrase_reveal_back_clicked' }

export const Layout = ({ keystore, sessionPassword, onMsg }: Props) => {
    const [loadable] = useLoadableData(decryptSecretPhrase, {
        type: 'loading',
        params: { sessionPassword, encryptedPhrase: keystore.encryptedPhrase },
    })

    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({
                                type: 'on_secret_phrase_reveal_back_clicked',
                            })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="SecretPhraseReveal.header"
                            defaultMessage="Write down Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="SecretPhraseReveal.subheader"
                            defaultMessage="Please write it down and keep it safely offline. We’ll then ask you to verify it."
                        />
                    }
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                            return null

                        case 'loaded':
                            return (
                                <>
                                    <BlurCurtain
                                        unblurElement={
                                            <Tag bg="surfaceDefault">
                                                <Row spacing={4}>
                                                    <BoldEye
                                                        size={16}
                                                        color="iconDefault"
                                                    />
                                                    <Text
                                                        variant="caption1"
                                                        color="textPrimary"
                                                        weight="regular"
                                                    >
                                                        {(() => {
                                                            switch (
                                                                ZealPlatform.OS
                                                            ) {
                                                                case 'ios':
                                                                case 'android':
                                                                    return (
                                                                        <FormattedMessage
                                                                            id="ViewSecretPhrase.unblur.mobile"
                                                                            defaultMessage="Tap to reveal"
                                                                        />
                                                                    )
                                                                case 'web':
                                                                    return (
                                                                        <FormattedMessage
                                                                            id="ViewSecretPhrase.unblur.web"
                                                                            defaultMessage="Hover to reveal"
                                                                        />
                                                                    )
                                                                /* istanbul ignore next */
                                                                default:
                                                                    return notReachable(
                                                                        ZealPlatform.OS
                                                                    )
                                                            }
                                                        })()}
                                                    </Text>
                                                </Row>
                                            </Tag>
                                        }
                                    >
                                        <SecretPhraseInput
                                            data-testid="write-down-phrase-input"
                                            errorWordsIndexes={[]}
                                            hidden={false}
                                            autoFocus={false}
                                            readOnly
                                            onChange={noop}
                                            onError={captureError}
                                            value={getDescendantsFromString(
                                                loadable.data
                                            )}
                                        />
                                    </BlurCurtain>

                                    <CopyPhraseButton
                                        decryptedPhrase={loadable.data}
                                    />
                                </>
                            )

                        case 'error':
                            return (
                                <AppErrorPopup
                                    error={parseAppError(loadable.error)}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'close':
                                            case 'try_again_clicked':
                                                onMsg({
                                                    type: 'on_secret_phrase_reveal_back_clicked',
                                                })
                                                break

                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(msg)
                                        }
                                    }}
                                />
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(loadable)
                    }
                })()}
            </Column>

            <Spacer />

            <Column spacing={16}>
                <InfoCard
                    variant="security"
                    icon={({ size }) => <Shield size={size} />}
                    subtitle={
                        <FormattedMessage
                            id="SecretPhraseReveal.hint"
                            defaultMessage="Don’t share your phrase with anyone. Keep it safe and offline"
                        />
                    }
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                        case 'error':
                            return (
                                <Actions>
                                    <Button
                                        size="regular"
                                        variant="secondary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_skip_verification_confirmation_click',
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.skipForNow"
                                            defaultMessage="Skip for now"
                                        />
                                    </Button>
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        disabled
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.verify"
                                            defaultMessage="Verify"
                                        />
                                    </Button>
                                </Actions>
                            )

                        case 'loaded':
                            return (
                                <Actions>
                                    <Button
                                        size="regular"
                                        variant="secondary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_skip_verification_confirmation_click',
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.skipForNow"
                                            defaultMessage="Skip for now"
                                        />
                                    </Button>
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_continue_to_verificaiton_click',
                                                decryptedPhrase: loadable.data,
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="SecretPhraseReveal.verify"
                                            defaultMessage="Verify"
                                        />
                                    </Button>
                                </Actions>
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(loadable)
                    }
                })()}
            </Column>
        </Screen>
    )
}
