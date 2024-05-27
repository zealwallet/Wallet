import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { Discord } from '@zeal/uikit/Icon/Discord'
import { Document } from '@zeal/uikit/Icon/Document'
import { Expand } from '@zeal/uikit/Icon/Expand'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { Logo } from '@zeal/uikit/Icon/Logo'
import { Privacy } from '@zeal/uikit/Icon/Privacy'
import { Scan } from '@zeal/uikit/Icon/Scan'
import { Twitter } from '@zeal/uikit/Icon/Twitter'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Mode } from '@zeal/domains/Main'
import {
    DISCORD_URL,
    TWITTER_URL,
    ZEAL_PRIVACY_POLICY_URL,
    ZEAL_TERMS_OF_USE_URL,
} from '@zeal/domains/Main/constants'
import { Manifest } from '@zeal/domains/Manifest'

type Props = {
    mode: Mode
    manifest: Manifest
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_lock_zeal_click' }
    | { type: 'on_manage_connections_click' }
    | { type: 'settings_add_new_account_click' }
    | { type: 'on_open_fullscreen_view_click' }

export const Layout = ({ mode, manifest, onMsg }: Props) => {
    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <ActionBar
                left={
                    <ActionBar.Header>
                        <FormattedMessage
                            id="settings.page.title"
                            defaultMessage="Settings"
                        />
                    </ActionBar.Header>
                }
            />
            <Column spacing={16}>
                {(() => {
                    switch (mode) {
                        case 'fullscreen':
                            return null
                        case 'popup':
                            return (
                                <Section>
                                    <Group variant="default">
                                        <ListItem
                                            size="regular"
                                            aria-current={false}
                                            avatar={({ size }) => (
                                                <Expand
                                                    size={size}
                                                    color="iconAccent2"
                                                />
                                            )}
                                            primaryText={
                                                <FormattedMessage
                                                    id="settings.open_expanded_view"
                                                    defaultMessage="Open expanded view"
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
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_open_fullscreen_view_click',
                                                })
                                            }
                                        />
                                    </Group>
                                </Section>
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(mode)
                    }
                })()}

                <Section>
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="settings.communitySecurity"
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
                                <Logo size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.addNewAccount"
                                    defaultMessage="Add new wallet"
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
                            onClick={() =>
                                onMsg({
                                    type: 'settings_add_new_account_click',
                                })
                            }
                        />
                        {(() => {
                            switch (ZealPlatform.OS) {
                                case 'ios':
                                case 'android':
                                    break
                                case 'web':
                                    return (
                                        <ListItem
                                            size="regular"
                                            aria-current={false}
                                            avatar={({ size }) => (
                                                <Scan
                                                    size={size}
                                                    color="iconAccent2"
                                                />
                                            )}
                                            primaryText={
                                                <FormattedMessage
                                                    id="settings.connections"
                                                    defaultMessage="Connections"
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
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_manage_connections_click',
                                                })
                                            }}
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
                                <BoldLock size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.lockZeal"
                                    defaultMessage="Lock Zeal"
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
                            onClick={() =>
                                onMsg({ type: 'on_lock_zeal_click' })
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
                                    id="settings.communityHeader"
                                    defaultMessage="Community"
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
                                <Discord size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.discord"
                                    defaultMessage="Discord"
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
                            onClick={() => {
                                openExternalURL(DISCORD_URL)
                            }}
                        />
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <Twitter size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.twitter"
                                    defaultMessage="Twitter"
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
                            onClick={() => {
                                openExternalURL(TWITTER_URL)
                            }}
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
                                    id="settings.LEGALHeader"
                                    defaultMessage="Legal"
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
                                <Privacy size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.privacyPolicy"
                                    defaultMessage="Privacy Policy"
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
                            onClick={() => {
                                openExternalURL(ZEAL_PRIVACY_POLICY_URL)
                            }}
                        />

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <Document size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="settings.termsOfUse"
                                    defaultMessage="Terms of Use"
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
                            onClick={() => {
                                openExternalURL(ZEAL_TERMS_OF_USE_URL)
                            }}
                        />
                    </Group>
                </Section>

                <Row spacing={0} alignX="center">
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                        align="center"
                    >
                        <FormattedMessage
                            id="settings.version"
                            defaultMessage="Version {version}"
                            values={{ version: manifest.version }}
                        />
                    </Text>
                </Row>
            </Column>
        </Screen>
    )
}
