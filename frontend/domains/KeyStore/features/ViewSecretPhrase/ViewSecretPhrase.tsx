import React from 'react'
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
import { Screen } from '@zeal/uikit/Screen'
import {
    getDescendantsFromString,
    SecretPhraseInput,
} from '@zeal/uikit/SecretPhraseInput'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AppErrorListItem } from '@zeal/domains/Error/components/AppErrorListItem'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { CopyPhraseButton } from '@zeal/domains/KeyStore/components/CopyPhraseButton'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'

type Props = {
    sessionPassword: string
    keyStore: SecretPhrase
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ViewSecretPhrase = ({
    keyStore,
    sessionPassword,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(decryptSecretPhrase, {
        type: 'loading',
        params: { sessionPassword, encryptedPhrase: keyStore.encryptedPhrase },
    })

    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="ViewSecretPhrase.header"
                            defaultMessage="Secret Phrase"
                        />
                    }
                    subtitle={(() => {
                        switch (ZealPlatform.OS) {
                            case 'ios':
                            case 'android':
                                return (
                                    <FormattedMessage
                                        id="ViewSecretPhrase.subheader.mobile"
                                        defaultMessage="Tap to reveal your Secret Phrase"
                                    />
                                )
                            case 'web':
                                return (
                                    <FormattedMessage
                                        id="ViewSecretPhrase.subheader.web"
                                        defaultMessage="Hover to reveal your Secret Phrase"
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(ZealPlatform.OS)
                        }
                    })()}
                />

                {(() => {
                    switch (loadable.type) {
                        case 'loading':
                            return (
                                <Skeleton
                                    variant="default"
                                    height={108}
                                    width="100%"
                                />
                            )

                        case 'loaded':
                            return (
                                <>
                                    <BlurCurtain
                                        unblurElement={
                                            <Tag bg="surfaceDefault">
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
                                            </Tag>
                                        }
                                    >
                                        <SecretPhraseInput
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
                                <AppErrorListItem
                                    error={parseAppError(loadable.error)}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'try_again_clicked':
                                                setLoadable({
                                                    type: 'loading',
                                                    params: loadable.params,
                                                })
                                                break

                                            default:
                                                notReachable(msg.type)
                                        }
                                    }}
                                />
                            )

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
                            id="ViewSecretPhrase.hint"
                            defaultMessage="Don’t share your phrase with anyone. Keep it safe and offline"
                        />
                    }
                />
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        <FormattedMessage
                            id="ViewSecretPhrase.done"
                            defaultMessage="Done"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
