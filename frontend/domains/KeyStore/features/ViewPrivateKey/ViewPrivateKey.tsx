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
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AppErrorListItem } from '@zeal/domains/Error/components/AppErrorListItem'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { getPrivateKey } from '@zeal/domains/KeyStore/helpers/getPrivateKey'

import { CopyKeyButton } from './CopyKeyButton'

type Props = {
    sessionPassword: string
    keyStore: PrivateKey | SecretPhrase
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ViewPrivateKey = ({ keyStore, sessionPassword, onMsg }: Props) => {
    const [loadable, setLoadable] = useLoadableData(getPrivateKey, {
        type: 'loading',
        params: { sessionPassword, keyStore },
    })

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
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

            <Column spacing={24} alignX="center">
                <Header
                    title={
                        <FormattedMessage
                            id="ViewPrivateKey.header"
                            defaultMessage="Private Key"
                        />
                    }
                    subtitle={(() => {
                        switch (ZealPlatform.OS) {
                            case 'ios':
                            case 'android':
                                return (
                                    <FormattedMessage
                                        id="ViewPrivateKey.subheader.mobile"
                                        defaultMessage="Tap to reveal your Private Key"
                                    />
                                )
                            case 'web':
                                return (
                                    <FormattedMessage
                                        id="ViewPrivateKey.subheader.web"
                                        defaultMessage="Hover to reveal your Private Key"
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

                        case 'loaded': {
                            const pk = Hexadecimal.remove0x(
                                loadable.data.privateKey
                            )

                            return (
                                <Column spacing={24} fill>
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
                                                                        id="ViewPrivateKey.unblur.mobile"
                                                                        defaultMessage="Tap to reveal"
                                                                    />
                                                                )
                                                            case 'web':
                                                                return (
                                                                    <FormattedMessage
                                                                        id="ViewPrivateKey.unblur.web"
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
                                        <Input
                                            keyboardType="default"
                                            type="multiline"
                                            onSubmitEditing={noop}
                                            variant="regular"
                                            placeholder=""
                                            value={pk}
                                            disabled
                                            state="normal"
                                            onChange={noop}
                                        />
                                    </BlurCurtain>

                                    <Column spacing={0} alignX="center">
                                        <CopyKeyButton pk={pk} />
                                    </Column>
                                </Column>
                            )
                        }

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
                            id="ViewPrivateKey.hint"
                            defaultMessage="Don’t share your private key with anyone. Keep it safe and offline"
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
