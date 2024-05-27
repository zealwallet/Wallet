import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { FlatList } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldStarWithinCircle } from '@zeal/uikit/Icon/BoldStarWithinCircle'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account } from '@zeal/domains/Account'
import { ActionBarAccountSelector } from '@zeal/domains/Account/components/ActionBarAccountSelector'
import { App, AppNft, AppProtocol, AppToken } from '@zeal/domains/App'
import { tokensFromProtocol } from '@zeal/domains/App/helpers/tokensFromProtocol'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { NetworkSelector } from '@zeal/domains/Network/components/NetworkSelector'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { BROWSE_MORE_DAPPS_URL } from '../../constants'
import { DiscoverMoreAppsListItem } from '../DiscoverMoreAppsListItem'
import { ListItem } from '../ListItem'

type Props = {
    apps: App[]
    account: Account
    installationId: string
    currincies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'network_filter_click' }
    | MsgOf<typeof ActionBarAccountSelector>
    | MsgOf<typeof ListItem>

type State = { searchInput: string }

export const Layout = ({
    apps,
    account,
    selectedNetwork,
    currincies,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    useEffect(() => {
        postUserEvent({
            type: 'AppListEnteredEvent',
            installationId,
        })
    }, [installationId])

    const [state, setState] = useState<State>({ searchInput: '' })

    const filteredApps =
        state.searchInput.length === 0
            ? apps
            : apps.filter((app) => {
                  const searchInput = state.searchInput.toLowerCase()

                  return searchMatchesApp(app, searchInput)
              })

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                top={
                    <ActionBarAccountSelector account={account} onMsg={onMsg} />
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4} shrink>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="medium"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="action_bar_title.defi"
                                    defaultMessage="DeFi"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
                right={
                    <NetworkSelector
                        variant="on_light"
                        size={24}
                        currentNetwork={selectedNetwork}
                        onClick={() => {
                            onMsg({ type: 'network_filter_click' })
                        }}
                    />
                }
            />

            <Column spacing={12} shrink>
                <Input
                    keyboardType="default"
                    onSubmitEditing={noop}
                    variant="regular"
                    value={state.searchInput}
                    onChange={(e) => {
                        setState({
                            searchInput: e.nativeEvent.text,
                        })
                    }}
                    state="normal"
                    placeholder="Search"
                />

                {!filteredApps.length ? (
                    <>
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <BoldStarWithinCircle size={size} />
                            )}
                            title={
                                <FormattedMessage
                                    id="apps_list.page.emptyState"
                                    defaultMessage="We found no apps here"
                                />
                            }
                        />
                        <Group variant="default">
                            <DiscoverMoreAppsListItem
                                onClick={() => {
                                    postUserEvent({
                                        type: 'DappLinkClickedEvent',
                                        dapp: 'Browse more',
                                        location: 'defi',
                                        installationId,
                                    })
                                    openExternalURL(BROWSE_MORE_DAPPS_URL)
                                }}
                            />
                        </Group>
                    </>
                ) : (
                    <>
                        <Column spacing={12}>
                            <Group variant="default">
                                <FlatList
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    data={filteredApps}
                                    renderItem={({ item: app }) => (
                                        <ListItem
                                            networkMap={networkMap}
                                            key={`${app.networkHexId}-${app.name}`}
                                            app={app}
                                            knownCurrencies={currincies}
                                            onMsg={onMsg}
                                        />
                                    )}
                                />
                            </Group>

                            <Group variant="default">
                                <DiscoverMoreAppsListItem
                                    onClick={() => {
                                        postUserEvent({
                                            type: 'DappLinkClickedEvent',
                                            dapp: 'Browse more',
                                            location: 'defi',
                                            installationId,
                                        })
                                        openExternalURL(BROWSE_MORE_DAPPS_URL)
                                    }}
                                />
                            </Group>
                        </Column>
                    </>
                )}
            </Column>
        </Screen>
    )
}

const searchMatchesApp = (app: App, searchInput: string) => {
    return (
        app.name.toLowerCase().includes(searchInput) ||
        app.protocols.some((protocol) =>
            searchMatchesProtocol(protocol, searchInput)
        )
    )
}

const searchMatchesProtocol = (protocol: AppProtocol, searchInput: string) => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
        case 'LendingAppProtocol':
        case 'LockedTokenAppProtocol':
        case 'VestingAppProtocol':
            return (
                protocol.category.includes(searchInput) ||
                searchMatchesTokensList(
                    tokensFromProtocol(protocol),
                    searchInput
                )
            )

        case 'UnknownAppProtocol':
            return (
                protocol.category.includes(searchInput) ||
                searchMatchesTokensList(
                    tokensFromProtocol(protocol),
                    searchInput
                ) ||
                searchMatchesNftsList(protocol.nfts, searchInput)
            )
        default:
            return notReachable(protocol)
    }
}

const searchMatchesTokensList = (list: AppToken[], searchInput: string) => {
    return list.some((token) => searchMatchesAppToken(token, searchInput))
}

const searchMatchesAppToken = (token: AppToken, searchInput: string) => {
    return (
        token.name.toLowerCase().includes(searchInput) ||
        token.address.toLowerCase().includes(searchInput)
    )
}

const searchMatchesNftsList = (list: AppNft[], searchInput: string) => {
    return list.some((nft) => searchMatchesAppNft(nft, searchInput))
}

const searchMatchesAppNft = (nft: AppNft, searchInput: string) => {
    if (!nft.name) {
        return false
    }

    return (
        nft.name.toLowerCase().includes(searchInput) ||
        nft.tokenId.toLowerCase().includes(searchInput)
    )
}
