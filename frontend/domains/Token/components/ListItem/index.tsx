import React from 'react'
import { useIntl } from 'react-intl'

import { Badge as UIBadge } from '@zeal/uikit/Avatar'
import { BoldStarFavourite } from '@zeal/uikit/Icon/BoldStarFavourite'
import { Spam } from '@zeal/uikit/Icon/Spam'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedRate } from '@zeal/domains/FXRate/components/FormattedRate'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Token } from '@zeal/domains/Token'
import { Avatar } from '@zeal/domains/Token/components/Avatar'

type Props = {
    token: Token
    'aria-current': boolean
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onClick?: () => void
}

const TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION = 2

export const ListItem = ({
    token,
    'aria-current': ariaCurrent,
    knownCurrencies,
    networkMap,
    currencyPinMap,
    currencyHiddenMap,
    onClick,
}: Props) => {
    const currency = useCurrencyById(token.balance.currencyId, knownCurrencies)
    return (
        <UIListItem
            size="large"
            onClick={onClick}
            aria-current={ariaCurrent}
            avatar={({ size }) => (
                <Avatar
                    leftBadge={({ size }) => {
                        if (
                            currencyHiddenMap[token.balance.currencyId] ||
                            (currencyHiddenMap[token.balance.currencyId] ===
                                undefined &&
                                token.scam)
                        ) {
                            return (
                                <UIBadge outlineColor="transparent" size={size}>
                                    <Spam
                                        size={size}
                                        color="iconStatusCritical"
                                    />
                                </UIBadge>
                            )
                        }

                        if (currencyPinMap[token.balance.currencyId]) {
                            return (
                                <UIBadge outlineColor="transparent" size={size}>
                                    <BoldStarFavourite size={size} />
                                </UIBadge>
                            )
                        }

                        return null
                    }}
                    key={token.balance.currencyId}
                    token={token}
                    knownCurrencies={knownCurrencies}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge
                            size={size}
                            network={findNetworkByHexChainId(
                                token.networkHexId,
                                networkMap
                            )}
                        />
                    )}
                />
            )}
            primaryText={currency?.symbol}
            shortText={
                (token.rate || token.marketData) && (
                    <Row spacing={4}>
                        {token.rate ? (
                            <Text ellipsis>
                                <FormattedRate
                                    rate={token.rate}
                                    knownCurriencies={knownCurrencies}
                                />
                            </Text>
                        ) : null}

                        {token.marketData ? (
                            <PriceChange24H marketData={token.marketData} />
                        ) : null}
                    </Row>
                )
            }
            side={{
                title: (
                    <FormattedTokenBalances
                        money={token.balance}
                        knownCurrencies={knownCurrencies}
                    />
                ),
                subtitle: token.priceInDefaultCurrency ? (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={token.priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ) : null,
            }}
        />
    )
}

export const PriceChange24H = ({
    marketData,
}: {
    marketData: NonNullable<Token['marketData']>
}) => {
    const { formatNumber } = useIntl()
    const sufix = (() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'web':
                return ''
            case 'android':
                return '%' // andoid ignore style: 'percent'
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    })()

    switch (marketData.priceChange24h.direction) {
        case 'Unchanged':
            return <Text ellipsis>0%</Text>

        case 'Up':
            return (
                <Text ellipsis color="textStatusSuccess">
                    +
                    {formatNumber(marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'never',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                    {sufix}
                </Text>
            )

        case 'Down':
            const prefix = (() => {
                switch (ZealPlatform.OS) {
                    case 'ios':
                        return '' // ios ignore signDisplay: 'never', for negative values
                    case 'android':
                    case 'web':
                        return '-'
                    /* istanbul ignore next */
                    default:
                        return notReachable(ZealPlatform.OS)
                }
            })()

            return (
                <Text ellipsis color="textStatusWarning">
                    {prefix}
                    {formatNumber(marketData.priceChange24h.percentage, {
                        style: 'percent',
                        signDisplay: 'never',
                        minimumFractionDigits: 0,
                        maximumFractionDigits:
                            TOKEN_PRICE_CHANGE_PERCENTAGE_PRECISION,
                    })}
                    {sufix}
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(marketData.priceChange24h)
    }
}
