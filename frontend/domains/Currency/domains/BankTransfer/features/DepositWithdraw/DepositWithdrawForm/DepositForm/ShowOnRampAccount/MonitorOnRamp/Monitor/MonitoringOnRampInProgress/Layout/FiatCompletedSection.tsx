import { FormattedMessage, useIntl } from 'react-intl'

import { GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldTickRound } from '@zeal/uikit/Icon/BoldTickRound'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { OnRampTransactionEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { FiatMoney, Money } from '@zeal/domains/Money'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'

type Props = {
    event: OnRampTransactionEvent
    knownCurrencies: KnownCurrencies
}

export const FiatCompletedSection = ({ event, knownCurrencies }: Props) => {
    const { formatMessage } = useIntl()
    const fiatMoney = getFiatMoney({ money: event.fiat, knownCurrencies })
    return (
        <Section>
            <GroupHeader
                left={({ color, textVariant, textWeight }) => (
                    <Text
                        color={color}
                        variant={textVariant}
                        weight={textWeight}
                    >
                        <FormattedMessage
                            id="MonitorOnRamp.from"
                            defaultMessage="From"
                        />
                    </Text>
                )}
                right={null}
            />
            <ListItem
                aria-current={false}
                size="large"
                primaryText={fiatMoney.currency.code}
                avatar={({ size }) => (
                    <Avatar
                        rightBadge={() => null}
                        size={size}
                        currency={fiatMoney.currency}
                    />
                )}
                side={{
                    title: (
                        <>
                            -
                            <FormattedTokenBalances
                                money={event.fiat}
                                knownCurrencies={knownCurrencies}
                            />
                        </>
                    ),
                    rightIcon: ({ size }) => (
                        <BoldTickRound
                            aria-label={formatMessage({
                                id: 'on_ramp.fiat_completed',
                                defaultMessage: 'Completed',
                            })}
                            size={size}
                            color="iconStatusSuccess"
                        />
                    ),
                }}
            />
        </Section>
    )
}

// TODO @resetko-zeal do this on parsing level
const getFiatMoney = ({
    money,
    knownCurrencies,
}: {
    money: Money
    knownCurrencies: KnownCurrencies
}): FiatMoney => {
    const currency = knownCurrencies[money.currencyId] || null

    if (!currency) {
        throw new ImperativeError(
            `Failed to find currency ${money.currencyId} in the dictionary`
        )
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return {
                amount: money.amount,
                currency: currency,
            }

        case 'CryptoCurrency':
            throw new ImperativeError(
                `CryptoCurrency found instead of FiatCurrency ${currency.id}`
            )

        default:
            return notReachable(currency)
    }
}
