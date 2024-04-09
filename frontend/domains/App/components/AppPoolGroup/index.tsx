import { ReactNode } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'

import { Divider } from '@zeal/uikit/Divider'
import { Group } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { AppNft, AppProtocol, AppToken, Lending } from '@zeal/domains/App'
import { AppNftListItem } from '@zeal/domains/App/components/AppNftListItem'
import { AppTokenListItem } from '@zeal/domains/App/components/AppTokenListItem'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    protocol: AppProtocol
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'on_health_rate_info_click'; protocol: Lending }

export const AppProtocolGroup = ({
    protocol,
    knownCurrencies,
    networkMap,
    onMsg,
}: Props) => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
            return (
                <Group variant="default">
                    <Header
                        protocol={protocol}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.supplied_tokens"
                                defaultMessage="Supplied tokens"
                            />
                        }
                        tokens={protocol.suppliedTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.borrowed_tokens"
                                defaultMessage="Borrowed tokens"
                            />
                        }
                        tokens={protocol.borrowedTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.reward_tokens"
                                defaultMessage="Reward tokens"
                            />
                        }
                        tokens={protocol.rewardTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                </Group>
            )

        case 'LockedTokenAppProtocol':
            return (
                <Group variant="default">
                    <Header
                        protocol={protocol}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.locked_tokens"
                                defaultMessage="Locked tokens"
                            />
                        }
                        tokens={protocol.lockedTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.reward_tokens"
                                defaultMessage="Reward tokens"
                            />
                        }
                        tokens={protocol.rewardTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                </Group>
            )

        case 'LendingAppProtocol':
            return (
                <Group variant="default">
                    <Header
                        protocol={protocol}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.supplied_tokens"
                                defaultMessage="Supplied tokens"
                            />
                        }
                        tokens={protocol.suppliedTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.borrowed_tokens"
                                defaultMessage="Borrowed tokens"
                            />
                        }
                        tokens={protocol.borrowedTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.reward_tokens"
                                defaultMessage="Reward tokens"
                            />
                        }
                        tokens={protocol.rewardTokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                </Group>
            )

        case 'VestingAppProtocol':
            return (
                <Group variant="default">
                    <Header
                        protocol={protocol}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.vesting_token"
                                defaultMessage="Vesting token"
                            />
                        }
                        tokens={[protocol.vestedToken]}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.claimable_amount"
                                defaultMessage="Claimable amount"
                            />
                        }
                        tokens={[protocol.claimableToken]}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                </Group>
            )
        case 'UnknownAppProtocol':
            return (
                <Group variant="default">
                    <Header
                        protocol={protocol}
                        knownCurrencies={knownCurrencies}
                        onMsg={onMsg}
                    />

                    <AppTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.tokens"
                                defaultMessage="Token"
                            />
                        }
                        tokens={protocol.tokens}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />

                    <NftTokenList
                        label={
                            <FormattedMessage
                                id="app.app_protocol_group.nfts"
                                defaultMessage="NFTs"
                            />
                        }
                        nfts={protocol.nfts}
                        knownCurrencies={knownCurrencies}
                    />
                </Group>
            )
        default:
            return notReachable(protocol)
    }
}

const Header = ({
    protocol,
    knownCurrencies,
    onMsg,
}: {
    protocol: AppProtocol
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}) => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={protocol.category}
                    shortText={protocol.description}
                    side={{
                        title: (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={protocol.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        ),
                    }}
                />
            )

        case 'LockedTokenAppProtocol':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={protocol.category}
                    shortText={<FormattedDate value={protocol.unlockAt} />}
                    side={{
                        title: (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={protocol.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        ),
                    }}
                />
            )

        case 'VestingAppProtocol':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={protocol.category}
                    side={{
                        title: (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={protocol.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        ),
                    }}
                />
            )

        case 'LendingAppProtocol':
            return (
                <>
                    <ListItem
                        aria-current={false}
                        size="regular"
                        primaryText={
                            <FormattedMessage
                                id="app.app_protocol_group.lending"
                                defaultMessage="Lending"
                            />
                        }
                        side={{
                            title: (
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={protocol.priceInDefaultCurrency}
                                    knownCurrencies={knownCurrencies}
                                />
                            ),
                        }}
                    />

                    <Divider variant="secondary" />

                    <ListItem
                        aria-current={false}
                        size="regular"
                        primaryText={
                            <Row spacing={4}>
                                <Text
                                    ellipsis
                                    color="textSecondary"
                                    variant="footnote"
                                    weight="regular"
                                >
                                    <FormattedMessage
                                        id="app.app_protocol_group.health_rate"
                                        defaultMessage="Health rate"
                                    />
                                </Text>

                                <Text
                                    ellipsis
                                    color="textSecondary"
                                    variant="footnote"
                                    weight="regular"
                                >
                                    <ProtocolHealthFactor
                                        healthFactor={protocol.healthFactor}
                                    />
                                </Text>
                            </Row>
                        }
                        side={{
                            rightIcon: ({ size }) => (
                                <IconButton
                                    variant="on_light"
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_health_rate_info_click',
                                            protocol: protocol,
                                        })
                                    }
                                >
                                    {({ color }) => (
                                        <InfoCircle size={size} color={color} />
                                    )}
                                </IconButton>
                            ),
                        }}
                    />
                </>
            )
        case 'UnknownAppProtocol':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    primaryText={protocol.category}
                    side={{
                        title: (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={protocol.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        ),
                    }}
                />
            )

        default:
            return notReachable(protocol)
    }
}

// TODO: @masm this is also implemented in App's ListItem
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
            {healthFactor.toFixed(2)}
        </Text>
    )
}

const AppTokenList = ({
    label,
    tokens,
    knownCurrencies,
    networkMap,
}: {
    label: ReactNode
    tokens: AppToken[]
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}) => {
    return tokens.length === 0 ? null : (
        <>
            <Divider variant="secondary" />
            <GroupHeader
                left={({ color, textVariant, textWeight }) => (
                    <Text
                        color={color}
                        variant={textVariant}
                        weight={textWeight}
                    >
                        {label}
                    </Text>
                )}
                right={null}
            />
            {tokens.map((token) => (
                <AppTokenListItem
                    key={token.address}
                    aria-current={false}
                    token={token}
                    knownCurrencies={knownCurrencies}
                    networkMap={networkMap}
                />
            ))}
        </>
    )
}

const NftTokenList = ({
    label,
    nfts,
    knownCurrencies,
}: {
    label: ReactNode
    nfts: AppNft[]
    knownCurrencies: KnownCurrencies
}) => {
    return nfts.length === 0 ? null : (
        <>
            <Divider variant="secondary" />
            <GroupHeader
                left={({ color, textVariant, textWeight }) => (
                    <Text
                        color={color}
                        variant={textVariant}
                        weight={textWeight}
                    >
                        {label}
                    </Text>
                )}
                right={null}
            />
            {nfts.map((nft) => (
                <AppNftListItem
                    key={nft.tokenId}
                    aria-current={false}
                    nft={nft}
                    knownCurrencies={knownCurrencies}
                />
            ))}
        </>
    )
}
