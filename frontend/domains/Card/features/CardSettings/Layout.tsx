import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { GnosisPayIcon } from '@zeal/uikit/Icon/GnosisPayIcon'
import { InfoCircleOutline } from '@zeal/uikit/Icon/InfoCircleOutline'
import { Key } from '@zeal/uikit/Icon/Key'
import { SolidZeal } from '@zeal/uikit/Icon/SolidZeal'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { openExternalURL } from '@zeal/toolkit/Window'

import { openGnosisPaySupport } from '@zeal/domains/Card/helpers/openGnosisPaySupport'
import { DISCORD_URL } from '@zeal/domains/Main/constants'
import { NotificationPermission } from '@zeal/domains/Notification'

type Props = {
    notificationPermissionLoadable: LoadableData<
        NotificationPermission,
        unknown
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_card_reveal_pin_clicked' }
    | {
          type: 'on_card_notifications_toggle_clicked'
          notificationPermission: NotificationPermission
      }
    | { type: 'close' }

export const Layout = ({ onMsg }: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => {
                onMsg({ type: 'close' })
            }}
        >
            <ActionBar
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="card.settings.page.title"
                                    defaultMessage="Settings"
                                />
                            </Text>
                        </Row>
                    </Clickable>
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
                                    id="card.settings.security"
                                    defaultMessage="Security"
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
                                <Key size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="card.settings.view-pin"
                                    defaultMessage="View PIN"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="card.settings.view-pin-description"
                                    defaultMessage="Always protect your PIN"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <InfoCircleOutline
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                            onClick={() => {
                                onMsg({
                                    type: 'on_card_reveal_pin_clicked',
                                })
                            }}
                        />

                        {/* FIXME @resetko-zeal add analytics */}
                        {/* FIXME @resetko-zeal render list item with toggle, disabled when loading and error */}

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => <GnosisPayIcon size={size} />}
                            primaryText={
                                <FormattedMessage
                                    id="card.settings.get-card-support"
                                    defaultMessage="Get help with card"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="card.settings.get-wallet-support-description"
                                    defaultMessage="Talk to Gnosis Pay support"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ExternalLink
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                            onClick={() => {
                                openGnosisPaySupport()
                            }}
                        />
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <SolidZeal size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="card.settings.get-wallet-support"
                                    defaultMessage="Get help with wallet"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="card.settings.get-wallet-support-description"
                                    defaultMessage="Talk to Zeal team on Discord"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ExternalLink
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                            onClick={() => {
                                openExternalURL(DISCORD_URL)
                            }}
                        />
                    </Group>
                </Section>
            </Column>
        </Screen>
    )
}
