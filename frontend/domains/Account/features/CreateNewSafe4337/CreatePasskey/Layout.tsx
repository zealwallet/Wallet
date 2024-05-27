import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CustomSafeLogo } from '@zeal/uikit/Icon/CustomSafeLogo'
import { FaceIdLogo } from '@zeal/uikit/Icon/FaceIdLogo'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_enable_biometrics_clicked' }

export const Layout = ({ onMsg }: Props) => (
    <Screen
        padding="form"
        background="light"
        onNavigateBack={() => onMsg({ type: 'close' })}
    >
        <ActionBar
            left={
                <IconButton
                    variant="on_light"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    {({ color }) => <BackIcon size={24} color={color} />}
                </IconButton>
            }
        />
        <Column spacing={24} fill>
            <Header
                title={
                    <FormattedMessage
                        id="create-passkey.title"
                        defaultMessage="Secure your wallet with biometrics"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="create-passkey.subtitle"
                        defaultMessage="Your wallet is secured with biometrics and Passkeys, leveraging device hardware security and encrypted cloud storage for recovery."
                    />
                }
                icon={({ color, size }) => (
                    <FaceIdLogo size={size} color={color} />
                )}
            />
            <Column spacing={8}>
                <Group variant="default">
                    <ListItem
                        aria-current={false}
                        size="regular"
                        avatar={({ size }) => (
                            <Avatar size={size} border="borderSecondary">
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    {1}
                                </Text>
                            </Avatar>
                        )}
                        primaryText={
                            <FormattedMessage
                                id="create-passkey.steps.setup-biometrics"
                                defaultMessage="Set up biometric security"
                            />
                        }
                    />
                </Group>
                <Group variant="default">
                    <ListItem
                        aria-current={false}
                        size="regular"
                        avatar={({ size }) => (
                            <Avatar size={size} border="borderSecondary">
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    {2}
                                </Text>
                            </Avatar>
                        )}
                        primaryText={
                            <FormattedMessage
                                id="create-passkey.steps.enable-recovery"
                                defaultMessage="Enable cloud recovery"
                            />
                        }
                    />
                </Group>
            </Column>

            <Spacer />

            <Row spacing={4} alignX="center">
                <Text variant="footnote" weight="regular" color="textSecondary">
                    <FormattedMessage
                        id="create-passkey.footnote"
                        defaultMessage="Powered by"
                    />
                </Text>
                <CustomSafeLogo color="textSecondary" />
            </Row>
            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({ type: 'on_enable_biometrics_clicked' })
                    }
                >
                    <FormattedMessage
                        id="create-passkey.mobile.cta"
                        defaultMessage="Enable biometrics"
                    />
                </Button>
            </Actions>
        </Column>
    </Screen>
)
