import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Tokens } from '@zeal/uikit/Icon/Empty'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import {
    Currency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { searchCurrencies } from '@zeal/domains/Currency/helpers/searchCurrencies'
import { ImperativeError } from '@zeal/domains/Error'
import { NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { ListItem } from '@zeal/domains/Token/components/ListItem'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    portfolio: Portfolio
    networkMap: NetworkMap
    selectedToken: Token | null
    knownCurrencies: KnownCurrencies
    account: Account
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}
type Msg = { type: 'close' } | { type: 'on_token_select'; token: Token }

export const ChooseToken = ({
    portfolio,
    selectedToken,
    account,
    knownCurrencies,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const searchResult = searchCurrencies({
        currencies: portfolio.tokens.map((token) => token.balance.currencyId),
        search,
        knownCurrencies,
        portfolio,
        currencyPinMap,
    })

    const selectedCurrencyId: CurrencyId | null =
        selectedToken?.balance.currencyId || null

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="choose-tokens-label"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                                id="choose-tokens-label"
                            >
                                <FormattedMessage
                                    id="SendERC20.tokens"
                                    defaultMessage="Tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />

            <Column shrink spacing={16} fill>
                <Column shrink spacing={8} fill>
                    <Input
                        keyboardType="default"
                        autoFocus
                        placeholder={formatMessage({
                            id: 'SendERC20.tokens.searchPlaceholder',
                            defaultMessage: 'Search',
                        })}
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        state="normal"
                        variant="regular"
                        onChange={(e) => setSearch(e.nativeEvent.text)}
                        value={search}
                        onSubmitEditing={noop}
                    />

                    {(() => {
                        switch (searchResult.type) {
                            case 'no_currencies_found':
                                return (
                                    <EmptyStateWidget
                                        icon={({ size }) => (
                                            <Tokens
                                                size={size}
                                                color="backgroundLight"
                                            />
                                        )}
                                        size="regular"
                                        title={
                                            <FormattedMessage
                                                id="ERC20.tokens.emptyState"
                                                defaultMessage="We found no tokens"
                                            />
                                        }
                                    />
                                )

                            case 'grouped_results': {
                                const sections: SectionListData<Token>[] = [
                                    {
                                        data: searchResult.portfolioCurrencies
                                            .map((currency) =>
                                                mapCurrencyToToken({
                                                    currency,
                                                    portfolio,
                                                })
                                            )
                                            .filter(
                                                filterByHideMap(
                                                    currencyHiddenMap
                                                )
                                            ),
                                    },
                                    {
                                        data: searchResult.nonPortfolioCurrencies
                                            .map((currency) =>
                                                mapCurrencyToToken({
                                                    currency,
                                                    portfolio,
                                                })
                                            )
                                            .filter(
                                                filterByHideMap(
                                                    currencyHiddenMap
                                                )
                                            ),
                                    },
                                ]

                                // TODO: we want to refactor so that search does filterByHideMap?
                                if (
                                    sections.every(
                                        (section) => section.data.length === 0
                                    )
                                ) {
                                    return (
                                        <EmptyStateWidget
                                            icon={({ size }) => (
                                                <Tokens
                                                    size={size}
                                                    color="backgroundLight"
                                                />
                                            )}
                                            size="regular"
                                            title={
                                                <FormattedMessage
                                                    id="ERC20.tokens.emptyState"
                                                    defaultMessage="We found no tokens"
                                                />
                                            }
                                        />
                                    )
                                }

                                return (
                                    <SectionList
                                        keyboardShouldPersistTaps="handled"
                                        variant="grouped"
                                        itemSpacing={8}
                                        sectionSpacing={8}
                                        sections={sections}
                                        renderItem={({ item: token }) => (
                                            <ListItem
                                                currencyHiddenMap={
                                                    currencyHiddenMap
                                                }
                                                currencyPinMap={currencyPinMap}
                                                key={token.balance.currencyId}
                                                networkMap={networkMap}
                                                aria-current={
                                                    selectedCurrencyId ===
                                                    token.balance.currencyId
                                                }
                                                knownCurrencies={
                                                    knownCurrencies
                                                }
                                                token={token}
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_token_select',
                                                        token,
                                                    })
                                                }
                                            />
                                        )}
                                    />
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </Column>
            </Column>
        </Screen>
    )
}

const mapCurrencyToToken = ({
    currency,
    portfolio,
}: {
    currency: Currency
    portfolio: Portfolio
}): Token => {
    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                'Fiat currency can not appear in SendERC20 flow'
            )

        case 'CryptoCurrency': {
            const portfolioToken =
                portfolio.tokens.find(
                    (token) => token.balance.currencyId === currency.id
                ) || null

            return (
                portfolioToken || {
                    address: currency.address,
                    balance: {
                        amount: 0n,
                        currencyId: currency.id,
                    },
                    networkHexId: currency.networkHexChainId,
                    priceInDefaultCurrency: null,
                    rate: null,
                    marketData: null,
                    scam: false,
                }
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
