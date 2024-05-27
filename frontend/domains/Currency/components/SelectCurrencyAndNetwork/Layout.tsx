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
import { IconButton } from '@zeal/uikit/IconButton'
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
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { ListItem } from '@zeal/domains/Token/components/ListItem'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    currencies: CurrencyId[]
    currentNetwork: CurrentNetwork

    selectedCurrencyId: CurrencyId | null

    account: Account
    keystoreMap: KeyStoreMap
    portfolio: Portfolio

    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_network_selection_click' }
    | { type: 'on_currency_selected'; currencyId: CurrencyId }

const mapCurrencyToToken = ({
    currency,
    portfolio,
}: {
    currency: Currency
    portfolio: Portfolio
}): Token => {
    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

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

export const Layout = ({
    currencies,
    currentNetwork,
    selectedCurrencyId,
    account,
    portfolio,
    keystoreMap,
    knownCurrencies,
    networkMap,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const searchResult = searchCurrencies({
        currencies,
        search,
        knownCurrencies,
        portfolio,
        currencyPinMap,
    })

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="select-currency-and-network-label"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textPrimary"
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
                                id="select-currency-and-network-label"
                            >
                                <FormattedMessage
                                    id="SelectCurrency.tokens"
                                    defaultMessage="Tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
                right={(() => {
                    switch (currentNetwork.type) {
                        case 'all_networks':
                            return null
                        case 'specific_network':
                            return (
                                <IconButton
                                    variant="on_light"
                                    arial-label={currentNetwork.network.name}
                                    // TODO: there seems to be an issue with aria-label above: it does not end up in the generated html, this might be fixed
                                    testID="tokens-network-filter-button"
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_network_selection_click',
                                        })
                                    }
                                >
                                    {() => (
                                        <Avatar
                                            currentNetwork={currentNetwork}
                                            size={24}
                                        />
                                    )}
                                </IconButton>
                            )

                        default:
                            return notReachable(currentNetwork)
                    }
                })()}
            />

            <Column fill shrink spacing={16}>
                <Column fill shrink spacing={8}>
                    <Input
                        keyboardType="default"
                        placeholder={formatMessage({
                            id: 'SelectCurrency.tokens.searchPlaceholder',
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
                                                id="SelectCurrency.tokens.emptyState"
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
                                        variant="grouped"
                                        keyboardShouldPersistTaps="handled"
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
                                                        type: 'on_currency_selected',
                                                        currencyId:
                                                            token.balance
                                                                .currencyId,
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
