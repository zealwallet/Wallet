import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldPaper } from '@zeal/uikit/Icon/BoldPaper'
import { OutlinedInterfaceLink } from '@zeal/uikit/Icon/OutlinedInterfaceLink'
import { OutlineFingerprint } from '@zeal/uikit/Icon/OutlineFingerprint'
import { SolidCloud } from '@zeal/uikit/Icon/SolidCloud'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_add_from_secret_phrase' }
    | { type: 'on_add_account_private_key' }
    | { type: 'on_add_account_from_recovery_kit' }
    | { type: 'on_add_account_from_hardware_wallet_click' }
    | { type: 'on_add_account_from_existing_phrase' }
    | { type: 'on_add_account_from_passkey' }
    | { type: 'close' }

export const Layout = ({ onMsg }: Props) => {
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

            <Column shrink spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="account.add.select_type.title"
                            defaultMessage="Import wallet using..."
                        />
                    }
                />
                <Column shrink spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldPaper size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.secret_phrase"
                                    defaultMessage="Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.secret_phrase.subtext"
                                    defaultMessage="From Metamask, Zeal or others"
                                />
                            }
                            onClick={() =>
                                onMsg({ type: 'on_add_from_secret_phrase' })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <SolidStatusKey
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.private_key"
                                    defaultMessage="Private Key"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.private_key.subtext"
                                    defaultMessage="From Metamask, Zeal or others"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_account_private_key',
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <OutlineFingerprint
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.select_type.passkey"
                                    defaultMessage="Recover from Passkey"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.select_type.passkey.subtext"
                                    defaultMessage="From your device/browser passkeys"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_account_from_passkey',
                                })
                            }
                        />
                    </Group>

                    {(() => {
                        switch (ZealPlatform.OS) {
                            case 'ios':
                            case 'android':
                                return null
                            case 'web':
                                return (
                                    <>
                                        <Group variant="default">
                                            <ListItem
                                                size="regular"
                                                aria-current={false}
                                                avatar={({ size }) => (
                                                    <SolidCloud
                                                        size={size}
                                                        color="iconAccent2"
                                                    />
                                                )}
                                                primaryText={
                                                    <FormattedMessage
                                                        id="account.add.select_type.zeal_recovery_file"
                                                        defaultMessage="Zeal Recovery File"
                                                    />
                                                }
                                                shortText={
                                                    <FormattedMessage
                                                        id="account.add.select_type.add_hardware_wallet.subtext"
                                                        defaultMessage="Encrypted on your personal cloud"
                                                    />
                                                }
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_add_account_from_recovery_kit',
                                                    })
                                                }
                                            />
                                        </Group>
                                        <Group variant="default">
                                            <ListItem
                                                size="regular"
                                                aria-current={false}
                                                avatar={({ size }) => (
                                                    <OutlinedInterfaceLink
                                                        size={size}
                                                        color="iconAccent2"
                                                    />
                                                )}
                                                primaryText={
                                                    <FormattedMessage
                                                        id="account.add.select_type.add_hardware_wallet"
                                                        defaultMessage="Hardware Wallet"
                                                    />
                                                }
                                                shortText={
                                                    <FormattedMessage
                                                        id="account.add.select_type.add_hardware_wallet.subtext"
                                                        defaultMessage="Connect Ledger or Trezor"
                                                    />
                                                }
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_add_account_from_hardware_wallet_click',
                                                    })
                                                }
                                            />
                                        </Group>
                                    </>
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(ZealPlatform.OS)
                        }
                    })()}
                </Column>
            </Column>
        </Screen>
    )
}
