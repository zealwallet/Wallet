import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { PlaceholderApp } from '@zeal/domains/App'
import { DiscoverMoreAppsListItem } from '@zeal/domains/App/components/DiscoverMoreAppsListItem'
import {
    BROWSE_MORE_DAPPS_URL,
    placeholderDapps,
} from '@zeal/domains/App/constants'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
}

// TODO @Fred move into App/features/AppBrowser once we implement full browser functionality
export const AppBrowser = ({ installationId }: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'BrowserOpenedEvent',
            installationId,
        })
    }, [installationId])

    return (
        <Screen
            padding="controller_tabs_fullscreen_scroll"
            background="light"
            onNavigateBack={null}
        >
            <ActionBar
                left={
                    <ActionBar.Header>
                        <FormattedMessage
                            id="browse.page.title"
                            defaultMessage="Browse Apps"
                        />
                    </ActionBar.Header>
                }
            ></ActionBar>

            <ScrollContainer>
                <Column spacing={16} fill alignY="stretch">
                    <Text variant="paragraph">
                        <FormattedMessage
                            id="browse.page.introduction"
                            defaultMessage="Connect to your favourite web3 Apps. Simply open an App in your browser and click connect. On mobile connect using WalletConnect"
                        />
                    </Text>

                    <Column spacing={16}>
                        <Group variant="default">
                            <Column spacing={8}>
                                {placeholderDapps.map(
                                    (item: PlaceholderApp, index: number) => (
                                        <ListItem
                                            key={index}
                                            aria-current={false}
                                            size="large"
                                            avatar={({ size }) => (
                                                <Avatar size={size}>
                                                    {item.logo(size)}
                                                </Avatar>
                                            )}
                                            primaryText={
                                                <Row
                                                    spacing={8}
                                                    alignX="center"
                                                >
                                                    <Text>{item.name}</Text>
                                                    <ExternalLink
                                                        color="textSecondary"
                                                        size={14}
                                                    ></ExternalLink>
                                                </Row>
                                            }
                                            shortText={item.description}
                                            onClick={() => {
                                                postUserEvent({
                                                    type: 'DappLinkClickedEvent',
                                                    dapp: item.name,
                                                    location: 'browser',
                                                    installationId,
                                                })
                                                openExternalURL(item.link)
                                            }}
                                        />
                                    )
                                )}
                            </Column>
                        </Group>
                        <Group variant="default">
                            <DiscoverMoreAppsListItem
                                onClick={() => {
                                    postUserEvent({
                                        type: 'DappLinkClickedEvent',
                                        dapp: 'Browse more',
                                        location: 'browser',
                                        installationId,
                                    })
                                    openExternalURL(BROWSE_MORE_DAPPS_URL)
                                }}
                            />
                        </Group>
                    </Column>
                </Column>
            </ScrollContainer>
        </Screen>
    )
}
