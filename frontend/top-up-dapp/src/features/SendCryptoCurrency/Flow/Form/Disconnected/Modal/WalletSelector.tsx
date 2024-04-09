import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Connector, useConnect } from 'wagmi'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar as UIAvatar, AvatarSize } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BrowserWallet } from '@zeal/uikit/Icon/BrowserWallet'
import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { CustomCoinbase } from '@zeal/uikit/Icon/CustomCoinbase'
import { CustomWalletConnect } from '@zeal/uikit/Icon/CustomWalletConnect'
import { LightWallet } from '@zeal/uikit/Icon/LightWallet'
import { IconButton } from '@zeal/uikit/IconButton'
import { Img } from '@zeal/uikit/Img'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Form } from '../../validation'

type Props = {
    form: Form
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const WalletSelector = ({ form, onMsg }: Props) => {
    const { connectAsync, connectors } = useConnect()

    const [loadable, setLoadable] = useLazyLoadableData(connectAsync)

    return (
        <Popup.Layout onMsg={onMsg} fixedViewPort>
            <Column spacing={0}>
                <ActionBar
                    left={
                        <Text
                            variant="title3"
                            weight="semi_bold"
                            color="textPrimary"
                        >
                            <FormattedMessage
                                id="SendCryptoCurrency.Flow.Form.Disconnected.Modal.WalletSelector.title"
                                defaultMessage="Connect wallet"
                            />
                        </Text>
                    }
                    right={
                        <IconButton
                            variant="on_light"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            {({ color }) => (
                                <CloseCross size={24} color={color} />
                            )}
                        </IconButton>
                    }
                />
                <Column spacing={8}>
                    {connectors.map((connector) => {
                        return (
                            <Group variant="default" key={connector.uid}>
                                {(() => {
                                    switch (loadable.type) {
                                        case 'not_asked':
                                        case 'error':
                                            return (
                                                <ListItem
                                                    onClick={() =>
                                                        setLoadable({
                                                            type: 'loading',
                                                            params: {
                                                                connector,
                                                                chainId: Number(
                                                                    form
                                                                        .currency
                                                                        .networkHexChainId
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    avatar={({ size }) => (
                                                        <WalletAvatar
                                                            size={size}
                                                            connector={
                                                                connector
                                                            }
                                                        />
                                                    )}
                                                    aria-current={false}
                                                    size="regular"
                                                    primaryText={
                                                        <WalletTitle
                                                            connector={
                                                                connector
                                                            }
                                                        />
                                                    }
                                                />
                                            )
                                        case 'loading':
                                        case 'loaded':
                                            return (
                                                <ListItem
                                                    avatar={({ size }) => (
                                                        <WalletAvatar
                                                            size={size}
                                                            connector={
                                                                connector
                                                            }
                                                        />
                                                    )}
                                                    aria-current={false}
                                                    size="regular"
                                                    primaryText={
                                                        <WalletTitle
                                                            connector={
                                                                connector
                                                            }
                                                        />
                                                    }
                                                    side={{
                                                        rightIcon: ({ size }) =>
                                                            connector ===
                                                            loadable.params
                                                                .connector ? (
                                                                <Spinner
                                                                    size={size}
                                                                    color="iconStatusNeutral"
                                                                />
                                                            ) : null,
                                                    }}
                                                />
                                            )
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(loadable)
                                    }
                                })()}
                            </Group>
                        )
                    })}
                </Column>
            </Column>
        </Popup.Layout>
    )
}

const WalletAvatar = ({
    connector,
    size,
}: {
    size: AvatarSize
    connector: Connector
}) => {
    return (
        <UIAvatar size={size} variant="rounded">
            {(() => {
                switch (connector.id) {
                    case 'injected':
                        return <BrowserWallet size={size} />
                    case 'coinbaseWalletSDK':
                        return <CustomCoinbase size={size} />
                    case 'walletConnect':
                        return <CustomWalletConnect size={size} />

                    default:
                        return connector.icon ? (
                            <Img src={connector.icon} size={size} />
                        ) : (
                            <LightWallet size={size} color="textSecondary" />
                        )
                }
            })()}
        </UIAvatar>
    )
}

const WalletTitle = ({ connector }: { connector: Connector }) => {
    switch (connector.id) {
        case 'injected':
            return (
                <FormattedMessage
                    id="injected-wallet"
                    defaultMessage="Browser wallet"
                />
            )

        default:
            return <>{connector.name}</>
    }
}
