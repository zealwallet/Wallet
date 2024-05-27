import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CustomGoogleDrive } from '@zeal/uikit/Icon/CustomGoogleDrive'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'
import { Screen } from '@zeal/uikit/Screen'
import { Spinner } from '@zeal/uikit/Spinner'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Skeleton = ({ onMsg }: Props) => {
    const skeletons = new Array(5).fill(true)
    return (
        <>
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
                            {({ color }) => (
                                <BackIcon size={24} color={color} />
                            )}
                        </IconButton>
                    }
                />

                <Column spacing={24}>
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
                                {skeletons.map((_, index) => (
                                    <ListItemSkeleton
                                        key={`skeleton-${index}-2`}
                                        avatar={({ size }) => (
                                            <CustomGoogleDrive size={size} />
                                        )}
                                        shortText
                                        side={{
                                            rightIcon: ({ size }) => (
                                                <ForwardIcon
                                                    size={size}
                                                    color="iconDefault"
                                                />
                                            ),
                                        }}
                                    />
                                ))}
                            </Column>
                        </Group>
                    </Section>
                </Column>
            </Screen>

            <Popup.Layout onMsg={onMsg}>
                <Header
                    icon={({ size, color }) => (
                        <Spinner size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="add.account.google.login.title"
                            defaultMessage="Waiting for approval..."
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="add.account.google.login.subtitle"
                            defaultMessage="Please approve request on Google Drive to sync your Recovery File"
                        />
                    }
                />
            </Popup.Layout>
        </>
    )
}
