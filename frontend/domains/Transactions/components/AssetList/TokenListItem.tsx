import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'

import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { MoneyByCurrency } from '@zeal/domains/Money'
import { FormattedFiatCurrency2 } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { TransactionToken } from '@zeal/domains/Transactions'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'

export const TokenListItem = ({
    token,
    networkMap,
}: {
    token: TransactionToken
    networkMap: NetworkMap
}) => {
    switch (token.amount.currency.type) {
        case 'CryptoCurrency': {
            const amount = token.amount as MoneyByCurrency<
                typeof token.amount.currency
            >

            const currency = amount.currency

            const network = findNetworkByHexChainId(
                amount.currency.networkHexChainId,
                networkMap
            )

            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <Avatar
                            currency={currency}
                            size={size}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={currency?.symbol}
                    side={{
                        title: (
                            <>
                                {getSign(token.direction)}
                                <FormattedTokenBalances2 money={amount} />
                            </>
                        ),
                    }}
                />
            )
        }

        case 'FiatCurrency': {
            const amount = token.amount as MoneyByCurrency<
                typeof token.amount.currency
            >

            const currency = amount.currency

            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <Avatar currency={currency} size={size} />
                    )}
                    primaryText={currency?.code}
                    side={{
                        title: (
                            <>
                                {getSign(token.direction)}
                                <FormattedFiatCurrency2
                                    minimumFractionDigits={0}
                                    money={amount}
                                />
                            </>
                        ),
                    }}
                />
            )
        }

        default:
            return notReachable(token.amount.currency)
    }
}
