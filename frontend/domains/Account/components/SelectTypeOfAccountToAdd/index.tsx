import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldHistory } from '@zeal/uikit/Icon/BoldHistory'
import { BoldNewWallet } from '@zeal/uikit/Icon/BoldNewWallet'
import { ConnectedLogo } from '@zeal/uikit/Icon/ConnectedLogo'
import { ExternalWallets } from '@zeal/uikit/Icon/ExternalWallets'
import { FaceIdLogo } from '@zeal/uikit/Icon/FaceIdLogo'
import { HardwareWallet } from '@zeal/uikit/Icon/HardwareWallet'
import { HardwareWalletsGroup } from '@zeal/uikit/Icon/HardwareWalletsGroup'
import { LightDownload } from '@zeal/uikit/Icon/LightDownload'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'track_wallet_clicked' }
    | { type: 'add_wallet_clicked' }
    | { type: 'create_clicked' }
    | { type: 'hardware_wallet_clicked' }
    | { type: 'safe_wallet_clicked' }

export const SelectTypeOfAccountToAdd = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Popup.Content>
                <ActionBar
                    left={
                        <ActionBar.Header>
                            <FormattedMessage
                                id="account.select_type_of_account.header"
                                defaultMessage="Add wallet"
                            />
                        </ActionBar.Header>
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
                <Column spacing={24}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.create"
                                    defaultMessage="Create wallet"
                                />
                            }
                            onClick={() => onMsg({ type: 'create_clicked' })}
                        />

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldHistory size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.restore_zeal"
                                    defaultMessage="Restore Zeal wallet"
                                />
                            }
                            side={{
                                rightIcon: () => <ConnectedLogo size={24} />,
                            }}
                            onClick={() =>
                                onMsg({ type: 'add_wallet_clicked' })
                            }
                        />

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <LightDownload
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.wallet"
                                    defaultMessage="Import other wallet"
                                />
                            }
                            side={{
                                rightIcon: () => <ExternalWallets />,
                            }}
                            onClick={() =>
                                onMsg({ type: 'add_wallet_clicked' })
                            }
                        />

                        {(() => {
                            switch (ZealPlatform.OS) {
                                case 'ios':
                                case 'android':
                                    return null
                                case 'web':
                                    return (
                                        <ListItem
                                            size="regular"
                                            aria-current={false}
                                            avatar={({ size }) => (
                                                <HardwareWallet
                                                    size={size}
                                                    color="iconAccent2"
                                                />
                                            )}
                                            primaryText={
                                                <FormattedMessage
                                                    id="account.select_type_of_account.hardware_wallet"
                                                    defaultMessage="Connect Hardware wallet"
                                                />
                                            }
                                            side={{
                                                rightIcon: () => (
                                                    <HardwareWalletsGroup />
                                                ),
                                            }}
                                            onClick={() =>
                                                onMsg({
                                                    type: 'hardware_wallet_clicked',
                                                })
                                            }
                                        />
                                    )
                                /* istanbul ignore next */
                                default:
                                    return notReachable(ZealPlatform.OS)
                            }
                        })()}

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <FaceIdLogo size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.safe_wallet"
                                    defaultMessage="Create Smart wallet"
                                />
                            }
                            side={{
                                rightIcon: () => (
                                    <Tag bg="backgroundDark">
                                        <Text
                                            variant="caption1"
                                            weight="regular"
                                            color="textOnDark"
                                        >
                                            <FormattedMessage
                                                id="account.select_type_of_account.beta"
                                                defaultMessage="Beta"
                                            />
                                        </Text>
                                    </Tag>
                                ),
                            }}
                            onClick={() =>
                                onMsg({ type: 'safe_wallet_clicked' })
                            }
                        />

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldEye size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.select_type_of_account.read_only_wallet"
                                    defaultMessage="Add read-only wallet"
                                />
                            }
                            onClick={() =>
                                onMsg({ type: 'track_wallet_clicked' })
                            }
                        />
                    </Group>
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
