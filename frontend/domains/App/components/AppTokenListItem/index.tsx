import { FormattedMessage } from 'react-intl'

import { ListItem } from '@zeal/uikit/ListItem/ListItem'
import { Text } from '@zeal/uikit/Text'

import { AppToken } from '@zeal/domains/App'
import { AppTokenAvatar } from '@zeal/domains/App/components/AppTokenAvatar'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

type Props = {
    'aria-current': boolean
    token: AppToken
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

export const AppTokenListItem = ({
    'aria-current': ariaCurrent,
    token,
    knownCurrencies,
    networkMap,
}: Props) => {
    const currency = useCurrencyById(token.balance.currencyId, knownCurrencies)

    return (
        <ListItem
            size="large"
            aria-current={ariaCurrent}
            avatar={({ size }) => (
                <AppTokenAvatar
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
            primaryText={
                currency ? (
                    currency.symbol
                ) : (
                    <Text
                        color="textSecondary"
                        variant="callout"
                        weight="medium"
                    >
                        <FormattedMessage
                            id="app.token_list_item.unknown"
                            defaultMessage="Unknown"
                        />
                    </Text>
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
