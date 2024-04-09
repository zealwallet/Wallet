import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { AvatarWithoutBadge } from '@zeal/domains/Account/components/Avatar'
import { format } from '@zeal/domains/Address/helpers/format'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { FormattedTokenInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenInDefaultCurrency'

import { TopUpRequest } from '../../TopUpRequest'

type Props = {
    knownCurrencies: KnownCurrencies | null
    currency: CryptoCurrency
    topUpRequest: TopUpRequest
}

export const TransactionContent = ({
    knownCurrencies,
    currency,
    topUpRequest,
}: Props) => {
    return (
        <Column spacing={20}>
            <Column spacing={4}>
                <Text
                    variant="paragraph"
                    color="textSecondary"
                    weight="regular"
                >
                    <FormattedMessage id="topup.send" defaultMessage="Send" />
                </Text>
                <ListItem
                    avatar={({ size }) => (
                        <Avatar currency={currency} size={size} />
                    )}
                    aria-current={false}
                    size="large"
                    primaryText={currency.code}
                    side={{
                        title: (
                            <>
                                -
                                <FormattedTokenBalances
                                    money={topUpRequest.amount}
                                    knownCurrencies={
                                        knownCurrencies ?? {
                                            [topUpRequest.amount.currencyId]:
                                                currency,
                                        }
                                    }
                                />
                            </>
                        ),
                        subtitle:
                            topUpRequest.amountInDefaultCurrency &&
                            knownCurrencies ? (
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    -
                                    <FormattedTokenInDefaultCurrency
                                        money={
                                            topUpRequest.amountInDefaultCurrency
                                        }
                                        knownCurrencies={knownCurrencies}
                                    />
                                </Text>
                            ) : null,
                    }}
                />
            </Column>
            <Column spacing={4}>
                <Text
                    variant="paragraph"
                    color="textSecondary"
                    weight="regular"
                >
                    <FormattedMessage id="topup.to" defaultMessage="To" />
                </Text>

                <ListItem
                    aria-current={false}
                    size="large"
                    primaryText={topUpRequest.zealAccount.label}
                    shortText={format(topUpRequest.zealAccount.address)}
                    avatar={({ size }) => (
                        <AvatarWithoutBadge
                            account={topUpRequest.zealAccount}
                            size={size}
                        />
                    )}
                />
            </Column>
        </Column>
    )
}
