import { FormattedMessage } from 'react-intl'

import { Chain } from '@zeal/uikit/Chain'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { excludeNullValues } from '@zeal/toolkit/Array/helpers/excludeNullValues'

import { App, AppProtocol } from '@zeal/domains/App'
import { Avatar } from '@zeal/domains/App/components/Avatar'
import { rewardTokensFromProtocol } from '@zeal/domains/App/helpers/rewardTokensFromProtocol'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { sum } from '@zeal/domains/Money/helpers/sum'
import { NetworkMap } from '@zeal/domains/Network'
import { Avatar as NetworkAvatar } from '@zeal/domains/Network/components/Avatar'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

type Props = {
    app: App
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_app_position_click'; app: App }

export const ListItem = ({
    app,
    knownCurrencies,
    networkMap,
    onMsg,
}: Props) => {
    return (
        <UIListItem
            size="large"
            aria-current={false}
            avatar={({ size }) => (
                <Avatar
                    app={app}
                    size={size}
                    badge={({ size }) => (
                        <NetworkAvatar
                            currentNetwork={{
                                type: 'specific_network',
                                network: findNetworkByHexChainId(
                                    app.networkHexId,
                                    networkMap
                                ),
                            }}
                            size={size}
                        />
                    )}
                />
            )}
            primaryText={app.name}
            shortText={<ProtocolDetails app={app} />}
            side={{
                title: (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={app.priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ),
                subtitle: (
                    <RewardsInfo app={app} knownCurrencies={knownCurrencies} />
                ),
            }}
            onClick={() => {
                onMsg({ type: 'on_app_position_click', app })
            }}
        />
    )
}

const ProtocolDetails = ({ app }: { app: App }) => {
    const protocol = lendingOrFirstProtocol(app)

    if (!protocol) {
        return null
    }

    switch (protocol.type) {
        case 'CommonAppProtocol':
        case 'LockedTokenAppProtocol':
        case 'VestingAppProtocol':
        case 'UnknownAppProtocol':
            return <Text>{protocol.category}</Text>

        case 'LendingAppProtocol':
            return (
                <Chain>
                    <Text>{protocol.category}</Text>
                    <Text>
                        <ProtocolHealthFactor
                            healthFactor={protocol.healthFactor}
                        />
                    </Text>
                </Chain>
            )
        default:
            return notReachable(protocol)
    }
}

const lendingOrFirstProtocol = (app: App): AppProtocol | null => {
    if (app.protocols.length === 0) {
        return null
    }

    const lending = app.protocols.find((protocol) => {
        switch (protocol.type) {
            case 'LendingAppProtocol':
                return true
            case 'LockedTokenAppProtocol':
            case 'VestingAppProtocol':
            case 'CommonAppProtocol':
            case 'UnknownAppProtocol':
                return false
            default:
                throw notReachable(protocol)
        }
    })

    return lending || app.protocols[0]
}

const ProtocolHealthFactor = ({ healthFactor }: { healthFactor: number }) => {
    return (
        <Text
            color={
                healthFactor >= 2
                    ? 'textStatusSuccess'
                    : healthFactor >= 1.1
                    ? 'textStatusWarning'
                    : 'textStatusCritical'
            }
        >
            {healthFactor > 10 ? '>10' : healthFactor.toFixed(2)}
        </Text>
    )
}

const RewardsInfo = ({
    app,
    knownCurrencies,
}: {
    app: App
    knownCurrencies: KnownCurrencies
}) => {
    const priceInDefaultCurrency = rewardsPriceInDefaultCurrency(app)

    if (!priceInDefaultCurrency) {
        return null
    }

    return (
        <FormattedMessage
            id="app.list_item.rewards"
            defaultMessage="Rewards {value}"
            values={{
                value: (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ),
            }}
        />
    )
}

const rewardsPriceInDefaultCurrency = (app: App) => {
    const allRewardTokens = app.protocols.flatMap(rewardTokensFromProtocol)

    const pricesInDefaultCurrency = allRewardTokens
        .map((token) => token.priceInDefaultCurrency)
        .filter(excludeNullValues)

    return sum(pricesInDefaultCurrency)
}
