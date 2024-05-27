import { FormattedMessage } from 'react-intl'

import { format } from 'date-fns'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CustomGoogleDrive } from '@zeal/uikit/Icon/CustomGoogleDrive'
import { DangerCircle } from '@zeal/uikit/Icon/DangerCircle'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT } from '@zeal/domains/KeyStore/constants'
import { parseEncryptedBackupContent } from '@zeal/domains/KeyStore/helpers/backup'

type Props = {
    files: {
        id: string
        name: string
        modifiedTime: number
        encryptedContent: unknown
    }[]
    onMsg: (msg: Msg) => void
}

type File = {
    id: string
    name: string
    modifiedTime: number
    encryptedContent: string
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'backup_file_selected'
          file: File
      }

export const SelectFile = ({ files, onMsg }: Props) => {
    return (
        <Screen
            background="light"
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
                            id="account.recovery_kit.select_backup_file.title"
                            defaultMessage="Recovery File"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="account.recovery_kit.select_backup_file.subtitle"
                            defaultMessage="Select the Recovery File you want to restore"
                        />
                    }
                />

                <Section>
                    <Group variant="default" scroll>
                        <Column spacing={8}>
                            {files.map((file, index) => {
                                const parseEncryptedContent =
                                    parseEncryptedBackupContent(
                                        file.encryptedContent
                                    )
                                switch (parseEncryptedContent.type) {
                                    case 'Failure':
                                        return (
                                            <ListItem
                                                key={index}
                                                size="regular"
                                                aria-current={false}
                                                avatar={({ size }) => (
                                                    <DangerCircle
                                                        color="iconStatusCritical"
                                                        size={size}
                                                    />
                                                )}
                                                primaryText={file.name.replace(
                                                    ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT,
                                                    ''
                                                )}
                                                shortText={
                                                    <Text color="textError">
                                                        <FormattedMessage
                                                            id="account.recovery_kit.select_backup_file.list.file_corrupted"
                                                            defaultMessage="Recovery File is not valid"
                                                        />
                                                    </Text>
                                                }
                                            />
                                        )
                                    case 'Success':
                                        return (
                                            <ListItem
                                                key={index}
                                                size="regular"
                                                aria-current={false}
                                                onClick={() => {
                                                    onMsg({
                                                        type: 'backup_file_selected',
                                                        file: {
                                                            ...file,
                                                            encryptedContent:
                                                                parseEncryptedContent.data,
                                                        },
                                                    })
                                                }}
                                                avatar={({ size }) => (
                                                    <CustomGoogleDrive
                                                        size={size}
                                                    />
                                                )}
                                                primaryText={file.name.replace(
                                                    ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT,
                                                    ''
                                                )}
                                                shortText={
                                                    <FormattedMessage
                                                        id="account.recovery_kit.select_backup_file.file_date"
                                                        defaultMessage="Created {date}"
                                                        values={{
                                                            date: format(
                                                                file.modifiedTime,
                                                                'd MMM yyyy'
                                                            ),
                                                        }}
                                                    />
                                                }
                                                side={{
                                                    rightIcon: ({ size }) => (
                                                        <ForwardIcon
                                                            size={size}
                                                            color="iconDefault"
                                                        />
                                                    ),
                                                }}
                                            />
                                        )
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(
                                            parseEncryptedContent
                                        )
                                }
                            })}
                        </Column>
                    </Group>
                </Section>
            </Column>
        </Screen>
    )
}
