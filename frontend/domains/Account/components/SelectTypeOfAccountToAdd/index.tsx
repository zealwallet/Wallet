import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldHistory } from '@zeal/uikit/Icon/BoldHistory'
import { ConnectedLogo } from '@zeal/uikit/Icon/ConnectedLogo'
import { Document } from '@zeal/uikit/Icon/Document'
import { ExternalWallets } from '@zeal/uikit/Icon/ExternalWallets'
import { HardwareWallet } from '@zeal/uikit/Icon/HardwareWallet'
import { HardwareWalletsGroup } from '@zeal/uikit/Icon/HardwareWalletsGroup'
import { LightDownload } from '@zeal/uikit/Icon/LightDownload'
import { PasskeyApple } from '@zeal/uikit/Icon/PasskeyApple'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
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
                <Column spacing={16}>
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
                    <Column spacing={16}>
                        <Section>
                            <GroupHeader
                                left={({ color, textVariant, textWeight }) => (
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="add-account.section.create.header"
                                            defaultMessage="Create new wallet"
                                        />
                                    </Text>
                                )}
                                right={null}
                            />
                            <Group variant="default">
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <PasskeyApple
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.safe_wallet.title"
                                            defaultMessage="Smart wallet"
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.safe_wallet.short"
                                            defaultMessage="Secured by biometrics and Safe"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({ type: 'safe_wallet_clicked' })
                                    }
                                />
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <Document
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.eoa.title"
                                            defaultMessage="Seed-phrase wallet"
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.eoa.short"
                                            defaultMessage="Classic wallet for advanced users"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({ type: 'create_clicked' })
                                    }
                                />
                            </Group>
                        </Section>
                        <Section>
                            <GroupHeader
                                left={({ color, textVariant, textWeight }) => (
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="add-account.section.import.header"
                                            defaultMessage="Import existing wallet"
                                        />
                                    </Text>
                                )}
                                right={null}
                            />
                            <Group variant="default">
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <BoldHistory
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.restore_zeal"
                                            defaultMessage="Zeal wallet"
                                        />
                                    }
                                    side={{
                                        rightIcon: () => (
                                            <ConnectedLogo size={28} />
                                        ),
                                    }}
                                    onClick={() =>
                                        onMsg({ type: 'add_wallet_clicked' })
                                    }
                                />

                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <BoldEye
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="account.select_type_of_account.read_only_wallet"
                                            defaultMessage="Read-only wallet"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({ type: 'track_wallet_clicked' })
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
                                            defaultMessage="Other wallets"
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
                            </Group>
                        </Section>
                    </Column>
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
