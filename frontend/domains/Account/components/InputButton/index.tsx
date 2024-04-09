import { Chain } from '@zeal/uikit/Chain'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { ListItemButton } from '@zeal/uikit/ListItem/ListItemButton'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge } from '@zeal/domains/Account/components/Avatar'
import { format } from '@zeal/domains/Address/helpers/format'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

type Props = {
    account: Account
    portfolio: Portfolio | null
    currencyHiddenMap: CurrencyHiddenMap
    onClick: () => void
}

export const InputButton = ({
    account,
    portfolio,
    currencyHiddenMap,
    onClick,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <ListItemButton
            onClick={onClick}
            avatar={({ size }) => (
                <AvatarWithoutBadge size={size} account={account} />
            )}
            primaryText={account.label}
            shortText={
                <Chain>
                    <Text>{format(account.address)}</Text>
                    {sum && (
                        <Text>
                            <FormattedTokenBalanceInDefaultCurrency
                                money={sum}
                                knownCurrencies={portfolio.currencies}
                            />
                        </Text>
                    )}
                </Chain>
            }
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    )
}
