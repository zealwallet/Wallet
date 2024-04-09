import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from '@zeal/uikit/Avatar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { GroupList } from '@zeal/uikit/GroupList'
import { ArrowLeft2 } from '@zeal/uikit/Icon/ArrowLeft2'
import { Tokens } from '@zeal/uikit/Icon/Empty'
import { Plus } from '@zeal/uikit/Icon/Plus'
import { SpamFolder } from '@zeal/uikit/Icon/SpamFolder'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBarAccountSelector } from '@zeal/domains/Account/components/ActionBarAccountSelector'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import {
    CurrentNetwork,
    CustomNetwork,
    NetworkMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { NetworkSelector } from '@zeal/domains/Network/components/NetworkSelector'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { ListItem } from '@zeal/domains/Token/components/ListItem'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    account: Account
    selectedNetwork: CurrentNetwork
    networkMap: NetworkMap
    portfolio: Portfolio
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof ActionBarAccountSelector>
    | { type: 'network_filter_click' }
    | { type: 'on_token_click'; token: Token }
    | {
          type: 'on_add_custom_currency_click'
          network: TestNetwork | CustomNetwork
      }
    | { type: 'on_show_hidden_token_click' }

export const Layout = ({
    account,
    selectedNetwork,
    portfolio,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const filteredTokens = portfolio.tokens.filter(
        filterByHideMap(currencyHiddenMap)
    )
    return (
        <Screen padding="form" background="light">
            <ActionBar
                top={
                    <ActionBarAccountSelector account={account} onMsg={onMsg} />
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4} shrink>
                            <ArrowLeft2 size={24} color="iconDefault" />

                            <Text
                                variant="title3"
                                weight="medium"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="action_bar_title.tokens"
                                    defaultMessage="Tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
                right={
                    <Row spacing={12}>
                        {(() => {
                            switch (selectedNetwork.type) {
                                case 'all_networks':
                                    return (
                                        <IconButton
                                            variant="on_light"
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_show_hidden_token_click',
                                                })
                                            }}
                                        >
                                            {({ color }) => (
                                                <SpamFolder
                                                    size={24}
                                                    color={color}
                                                />
                                            )}
                                        </IconButton>
                                    )
                                case 'specific_network':
                                    const net = selectedNetwork.network
                                    switch (net.type) {
                                        case 'predefined':
                                            return (
                                                <IconButton
                                                    variant="on_light"
                                                    onClick={() => {
                                                        onMsg({
                                                            type: 'on_show_hidden_token_click',
                                                        })
                                                    }}
                                                >
                                                    {({ color }) => (
                                                        <SpamFolder
                                                            size={24}
                                                            color={color}
                                                        />
                                                    )}
                                                </IconButton>
                                            )
                                        case 'custom':
                                        case 'testnet':
                                            return (
                                                <Tertiary
                                                    color="on_light"
                                                    size="regular"
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_add_custom_currency_click',
                                                            network: net,
                                                        })
                                                    }
                                                >
                                                    {({ color }) => (
                                                        <Avatar size={24}>
                                                            <Plus
                                                                size={24}
                                                                color={color}
                                                            />
                                                        </Avatar>
                                                    )}
                                                </Tertiary>
                                            )
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(net)
                                    }

                                /* istanbul ignore next */
                                default:
                                    return notReachable(selectedNetwork)
                            }
                        })()}

                        <NetworkSelector
                            variant="on_light"
                            size={24}
                            currentNetwork={selectedNetwork}
                            onClick={() => {
                                onMsg({ type: 'network_filter_click' })
                            }}
                        />
                    </Row>
                }
            />

            <Column spacing={12} shrink>
                {!!filteredTokens.length ? (
                    <GroupList
                        data={filteredTokens}
                        renderItem={({ item: token }) => {
                            return (
                                <ListItem
                                    currencyHiddenMap={currencyHiddenMap}
                                    currencyPinMap={currencyPinMap}
                                    aria-current={false}
                                    networkMap={networkMap}
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_token_click',
                                            token,
                                        })
                                    }}
                                    key={`${token.networkHexId}-${token.balance.currencyId}`}
                                    token={token}
                                    knownCurrencies={portfolio.currencies}
                                />
                            )
                        }}
                    />
                ) : (
                    <Group variant="default">
                        <EmptyState
                            selectedNetwork={selectedNetwork}
                            onAddCustomClick={(testNetwork) =>
                                onMsg({
                                    type: 'on_add_custom_currency_click',
                                    network: testNetwork,
                                })
                            }
                        />
                    </Group>
                )}
            </Column>
        </Screen>
    )
}

// TODO Move to separate component if it's too much copypaste with other token list empty states
const EmptyState = ({
    selectedNetwork,
    onAddCustomClick,
}: {
    selectedNetwork: CurrentNetwork
    onAddCustomClick: (network: TestNetwork | CustomNetwork) => void
}) => {
    switch (selectedNetwork.type) {
        case 'all_networks':
            return (
                <EmptyStateWidget
                    size="regular"
                    icon={({ size }) => (
                        <Tokens size={size} color="backgroundLight" />
                    )}
                    title={
                        <FormattedMessage
                            id="token.widget.emptyState"
                            defaultMessage="We found no tokens"
                        />
                    }
                />
            )
        case 'specific_network': {
            const net = selectedNetwork.network
            switch (net.type) {
                case 'predefined':
                    return (
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <Tokens size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="token.widget.emptyState"
                                    defaultMessage="We found no tokens"
                                />
                            }
                        />
                    )
                case 'custom':
                case 'testnet':
                    return (
                        <EmptyStateWidget
                            onClick={() => onAddCustomClick(net)}
                            size="regular"
                            icon={({ size }) => (
                                <Tokens size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="token.widget.addTokens"
                                    defaultMessage="Add tokens"
                                />
                            }
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(net)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(selectedNetwork)
    }
}
