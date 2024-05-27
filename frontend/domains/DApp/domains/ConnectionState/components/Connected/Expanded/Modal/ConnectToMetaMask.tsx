import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItemButton } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { ListItem } from '@zeal/domains/DApp/components/ListItem'
import { Connected } from '@zeal/domains/DApp/domains/ConnectionState'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    connectionState: Connected
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_continue_with_meta_mask' }
    | { type: 'on_connect_to_metamask_click' }

export const ConnectToMetaMask = ({
    connectionState,
    installationId,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form" onNavigateBack={null}>
            <ActionBar
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            onMsg({ type: 'close' })
                        }}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connected.expanded.meta_mask_selcted.title"
                                    defaultMessage="Connect"
                                />
                            }
                        />
                    }
                    footer={null}
                >
                    <Column spacing={20}>
                        <ListItem
                            variant="regular"
                            highlightHostName={null}
                            dApp={connectionState.dApp}
                        />
                        <Column spacing={24}>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="connection_state.connected.expanded.meta_mask_selcted.connect_wallets"
                                        defaultMessage="Connect to"
                                    />
                                </Text>
                                <ListItemButton
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_connect_to_metamask_click',
                                        })
                                    }}
                                    avatar={({ size }) => (
                                        <CustomMetamask size={size} />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="connection_state.connect.metamask"
                                            defaultMessage="MetaMask"
                                        />
                                    }
                                    side={{
                                        rightIcon: ({ size }) => (
                                            <LightArrowDown2
                                                size={size}
                                                color="iconDefault"
                                            />
                                        ),
                                    }}
                                />
                            </Column>
                        </Column>
                    </Column>
                </Content>
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionToggledToMetamaskEvent',
                                installationId,
                            })
                            onMsg({
                                type: 'on_continue_with_meta_mask',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connect.cancel"
                            defaultMessage="Continue with MetaMask"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
