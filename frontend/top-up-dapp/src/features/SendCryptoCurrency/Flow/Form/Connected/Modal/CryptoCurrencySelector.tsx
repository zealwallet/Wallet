import { FormattedMessage } from 'react-intl'
import { SectionListData } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { ImperativeError } from '@zeal/domains/Error'
import { FormattedRate } from '@zeal/domains/FXRate/components/FormattedRate'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'

type Props = {
    topUpCurrencies: CryptoCurrency[]
    selectedCurrency: CryptoCurrency
    portfolioLoadable: LoadableData<Portfolio, unknown>
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_crypto_currency_selected'; currency: CryptoCurrency }

const sortCurrenciesByBalance =
    (tokens: Token[]) =>
    (a: CryptoCurrency, b: CryptoCurrency): number => {
        const tokenA = tokens.find((t) => t.balance.currencyId === a.id)
        const tokenB = tokens.find((t) => t.balance.currencyId === b.id)

        if (!tokenA || !tokenB) {
            return 0
        }

        if (!tokenA.priceInDefaultCurrency) {
            return tokenB.priceInDefaultCurrency ? 1 : 0
        }

        if (!tokenB.priceInDefaultCurrency) {
            return -1
        }

        return Number(
            tokenB.priceInDefaultCurrency.amount -
                tokenA.priceInDefaultCurrency.amount
        )
    }

export const CryptoCurrencySelector = ({
    onMsg,
    portfolioLoadable,
    selectedCurrency,
    topUpCurrencies,
}: Props) => {
    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <ActionBar
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
                                    id="top-up.choose-tokens-label"
                                    defaultMessage="Tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />
            <SectionList
                variant="grouped"
                sections={groupCurrencies(topUpCurrencies, portfolioLoadable)}
                sectionSpacing={8}
                itemSpacing={8}
                renderItem={({ item: currency }) => (
                    <ListItem
                        portfolioLoadable={portfolioLoadable}
                        currency={currency}
                        selected={currency.id === selectedCurrency.id}
                        onClick={() =>
                            onMsg({
                                type: 'on_crypto_currency_selected',
                                currency,
                            })
                        }
                    />
                )}
            />
        </Screen>
    )
}

const ListItem = ({
    currency,
    onClick,
    selected,
    portfolioLoadable,
}: {
    currency: CryptoCurrency
    portfolioLoadable: LoadableData<Portfolio, unknown>
    selected: boolean
    onClick: () => void
}) => {
    const network = PREDEFINED_NETWORKS.find(
        (network) => network.hexChainId === currency.networkHexChainId
    )

    if (!network) {
        throw new ImperativeError(
            `Network ${currency.networkHexChainId} not found in disconnected currency selector`
        )
    }

    const noTokenItem = (
        <UIListItem
            onClick={onClick}
            key={currency.id}
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge network={network} size={size} />
                    )}
                />
            )}
            aria-current={selected}
            size="large"
            primaryText={currency.code}
        />
    )

    switch (portfolioLoadable.type) {
        case 'loading':
        case 'error':
            return noTokenItem

        case 'loaded':
            const token =
                portfolioLoadable.data.tokens.find(
                    (token) => token.balance.currencyId === currency.id
                ) || null

            return token ? (
                <UIListItem
                    onClick={onClick}
                    key={currency.id}
                    avatar={({ size }) => (
                        <Avatar
                            currency={currency}
                            size={size}
                            rightBadge={({ size }) => (
                                <Badge network={network} size={size} />
                            )}
                        />
                    )}
                    shortText={
                        token.rate ? (
                            <FormattedRate
                                rate={token.rate}
                                knownCurriencies={
                                    portfolioLoadable.data.currencies
                                }
                            />
                        ) : null
                    }
                    side={{
                        title: (
                            <FormattedTokenBalances
                                money={token.balance}
                                knownCurrencies={
                                    portfolioLoadable.data.currencies
                                }
                            />
                        ),
                        subtitle: token.priceInDefaultCurrency ? (
                            <FormattedTokenBalanceInDefaultCurrency
                                money={token.priceInDefaultCurrency}
                                knownCurrencies={
                                    portfolioLoadable.data.currencies
                                }
                            />
                        ) : null,
                    }}
                    aria-current={selected}
                    size="large"
                    primaryText={currency.code}
                />
            ) : (
                noTokenItem
            )

        default:
            return notReachable(portfolioLoadable)
    }
}

const groupCurrencies = (
    topUpCurrencies: CryptoCurrency[],
    portfolioLoadable: LoadableData<Portfolio, unknown>
): SectionListData<CryptoCurrency>[] => {
    switch (portfolioLoadable.type) {
        case 'loading':
        case 'error':
            return [{ data: topUpCurrencies }]
        case 'loaded': {
            const portfolioCurrencies = topUpCurrencies.filter(
                (topUpCurrency) =>
                    portfolioLoadable.data.tokens.some(
                        (token) => token.balance.currencyId === topUpCurrency.id
                    )
            )
            const nonPortfolioCurrencies = topUpCurrencies.filter(
                (topUpCurrency) =>
                    !portfolioLoadable.data.tokens.some(
                        (token) => token.balance.currencyId === topUpCurrency.id
                    )
            )

            return [
                {
                    data: portfolioCurrencies.sort(
                        sortCurrenciesByBalance(portfolioLoadable.data.tokens)
                    ),
                },
                { data: nonPortfolioCurrencies },
            ]
        }
        /* istanbul ignore next */
        default:
            return notReachable(portfolioLoadable)
    }
}
