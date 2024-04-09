import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { ExplorerLink } from '@zeal/domains/Currency/components/ExplorerLink'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { FormattedTokenInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenInDefaultCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { CurrencyBadge } from '@zeal/domains/SafetyCheck/components/CurrencyBadge'
import { UnknownTransactionToken } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    token: UnknownTransactionToken
    safetyChecks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}

const sign = (token: UnknownTransactionToken): string => {
    switch (token.direction) {
        case 'Send':
            return '-'

        case 'Receive':
            return '+'

        /* istanbul ignore next */
        default:
            return notReachable(token.direction)
    }
}

export const Token = ({
    token,
    networkMap,
    knownCurrencies,
    safetyChecks,
}: Props) => {
    const currency = useCurrencyById(token.amount.currencyId, knownCurrencies)

    return (
        <ListItem
            aria-current={false}
            primaryText={
                currency ? (
                    <Row alignY="center" spacing={4}>
                        <Text>{currency.symbol}</Text>
                        <ExplorerLink
                            networkMap={networkMap}
                            currency={currency}
                        />
                    </Row>
                ) : null
            }
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <CurrencyBadge
                            size={size}
                            currencyId={currency && currency.id}
                            safetyChecks={safetyChecks}
                        />
                    )}
                />
            )}
            size="large"
            side={{
                title: (
                    <>
                        {sign(token)}
                        <FormattedTokenBalances
                            money={token.amount}
                            knownCurrencies={knownCurrencies}
                        />
                    </>
                ),
                subtitle: token.priceInDefaultCurrency ? (
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {sign(token)}
                        <FormattedTokenInDefaultCurrency
                            money={token.priceInDefaultCurrency}
                            knownCurrencies={knownCurrencies}
                        />
                    </Text>
                ) : null,
            }}
            aria-labelledby={`token-list-item-label-${currency && currency.id}`}
        />
    )
}
