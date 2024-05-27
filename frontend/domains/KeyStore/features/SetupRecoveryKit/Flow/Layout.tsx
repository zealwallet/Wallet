import { FormattedMessage } from 'react-intl'

import { formatDistanceToNowStrict } from 'date-fns'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar, Badge } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldTickSmall } from '@zeal/uikit/Icon/BoldTickSmall'
import { CustomGoogleDrive } from '@zeal/uikit/Icon/CustomGoogleDrive'
import { Paper } from '@zeal/uikit/Icon/Paper'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { SecretPhrase } from '@zeal/domains/KeyStore'

type Props = {
    keystore: SecretPhrase
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_google_drive_backup_click' }
    | { type: 'on_write_down_secret_phrase_click' }

export const Layout = ({ keystore, onMsg }: Props) => {
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

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="SetupRecoveryKit.title"
                            defaultMessage="Set Up Recovery Kit"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="SetupRecoveryKit.subtitle"
                            defaultMessage="You’ll need at least one way to restore your account if you uninstall Zeal or switch devices"
                        />
                    }
                />

                <Column spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <Avatar
                                    size={size}
                                    rightBadge={({ size }) =>
                                        keystore.googleDriveFile ? (
                                            <Badge
                                                size={size}
                                                backgroundColor="statusSuccess"
                                            >
                                                <BoldTickSmall
                                                    size={size}
                                                    color="iconDefaultOnDark"
                                                />
                                            </Badge>
                                        ) : null
                                    }
                                >
                                    <CustomGoogleDrive
                                        size={size}
                                        color="iconAccent2"
                                    />
                                </Avatar>
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.google.title"
                                    defaultMessage="Google Drive backup"
                                />
                            }
                            shortText={
                                keystore.googleDriveFile ? (
                                    <FormattedMessage
                                        id="SetupRecoveryKit.google.subtitle"
                                        defaultMessage="Synced {date}"
                                        values={{
                                            date: formatDistanceToNowStrict(
                                                keystore.googleDriveFile
                                                    .modifiedTime,
                                                {
                                                    addSuffix: true,
                                                    roundingMethod: 'floor',
                                                }
                                            ),
                                        }}
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="SetupRecoveryKit.google.encrypt_a_recovery_file_with_password"
                                        defaultMessage="Encrypt a Recovery File with password"
                                    />
                                )
                            }
                            onClick={() =>
                                onMsg({ type: 'on_google_drive_backup_click' })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <Avatar
                                    size={size}
                                    rightBadge={({ size }) =>
                                        keystore.confirmed ? (
                                            <Badge
                                                size={size}
                                                backgroundColor="statusSuccess"
                                            >
                                                <BoldTickSmall
                                                    size={size}
                                                    color="iconDefaultOnDark"
                                                />
                                            </Badge>
                                        ) : null
                                    }
                                >
                                    <Paper size={size} color="iconAccent2" />
                                </Avatar>
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.writeDown.title"
                                    defaultMessage="Manual backup"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="SetupRecoveryKit.writeDown.subtitle"
                                    defaultMessage="Write down Secret Phrase"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_write_down_secret_phrase_click',
                                })
                            }
                        />
                    </Group>
                </Column>
            </Column>
        </Screen>
    )
}
