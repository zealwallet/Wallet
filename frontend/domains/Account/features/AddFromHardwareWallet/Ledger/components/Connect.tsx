import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

type Props = {
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_connect_button_click' } | { type: 'close' }

export const Connect = ({ onMsg, isLoading }: Props) => {
    return (
        <Screen
            background="default"
            padding="form"
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
            <Column shrink spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="ledger.connect.title"
                            defaultMessage="Connect Ledger to Zeal"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ledger.connect.subtitle"
                            defaultMessage="Follow these steps to import your Ledger wallets to Zeal"
                        />
                    }
                />
                <Column shrink spacing={4}>
                    <ListItem
                        size="large"
                        aria-current={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step1"
                                defaultMessage="Connect Ledger to your device"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="borderSecondary" size={size}>
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    1
                                </Text>
                            </Avatar>
                        )}
                    />

                    <ListItem
                        size="large"
                        aria-current={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step2"
                                defaultMessage="Open the Ethereum app on Ledger"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="borderSecondary" size={size}>
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    2
                                </Text>
                            </Avatar>
                        )}
                    />

                    <ListItem
                        size="large"
                        aria-current={false}
                        primaryText={
                            <FormattedMessage
                                id="ledger.connect.step3"
                                defaultMessage="Then sync your Ledger 👇"
                            />
                        }
                        avatar={({ size }) => (
                            <Avatar border="borderSecondary" size={size}>
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    3
                                </Text>
                            </Avatar>
                        )}
                    />
                </Column>
            </Column>
            <Spacer />
            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    disabled={isLoading}
                    onClick={() => {
                        onMsg({ type: 'on_connect_button_click' })
                    }}
                >
                    <FormattedMessage
                        id="ledger.connect.cta"
                        defaultMessage="Sync Ledger"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
