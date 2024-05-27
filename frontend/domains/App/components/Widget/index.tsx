import { Avatar } from '@zeal/uikit/Avatar'
import { Group, Section } from '@zeal/uikit/Group'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { openExternalURL } from '@zeal/toolkit/Window'

import { App, PlaceholderApp } from '@zeal/domains/App'
import { placeholderDapps } from '@zeal/domains/App/constants'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { AppsGroupHeader } from '../AppsGroupHeader'
import { ListItem } from '../ListItem'

type Props = {
    apps: App[]
    currencies: KnownCurrencies
    networkMap: NetworkMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'show_all_apps_click' }
    | { type: 'discover_more_apps_click' }
    | MsgOf<typeof ListItem>

const NUM_OF_ELEMENTS = 3

export const Widget = ({
    apps,
    currencies,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    return (
        <Section>
            <Group variant="widget">
                <AppsGroupHeader
                    knownCurrencies={currencies}
                    apps={apps}
                    onClick={
                        apps.length
                            ? () => {
                                  onMsg({ type: 'show_all_apps_click' })
                              }
                            : () => {
                                  switch (ZealPlatform.OS) {
                                      case 'ios':
                                      case 'android':
                                          onMsg({
                                              type: 'discover_more_apps_click',
                                          })
                                          break
                                      case 'web':
                                          break
                                      default:
                                          return notReachable(ZealPlatform.OS)
                                  }
                              }
                    }
                />
                {apps.length ? (
                    apps
                        .slice(0, NUM_OF_ELEMENTS)
                        .map((app) => (
                            <ListItem
                                networkMap={networkMap}
                                key={`${app.networkHexId}${app.name}`}
                                knownCurrencies={currencies}
                                app={app}
                                onMsg={onMsg}
                            />
                        ))
                ) : (
                    <AppsEmptyState installationId={installationId} />
                )}
            </Group>
        </Section>
    )
}

type AppsEmptyStateProps = {
    installationId: string
}

const AppsEmptyState = ({ installationId }: AppsEmptyStateProps) => {
    return (
        <>
            {placeholderDapps
                .slice(0, NUM_OF_ELEMENTS)
                .map((item: PlaceholderApp, index: number) => (
                    <UIListItem
                        key={index}
                        aria-current={false}
                        size="large"
                        avatar={({ size }) => (
                            <Avatar size={size}>{item.logo(size)}</Avatar>
                        )}
                        primaryText={
                            <Row spacing={8} alignX="center">
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
                                location: 'home',
                                installationId,
                            })
                            openExternalURL(item.link)
                        }}
                    />
                ))}
        </>
    )
}
