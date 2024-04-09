import { FormattedMessage } from 'react-intl'

import { GroupHeader, Section } from '@zeal/uikit/Group'
import { ListItem } from '@zeal/uikit/ListItem/ListItem'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import {
    OnRampTransactionCryptoTransferIssuedEvent,
    OnRampTransactionFailedEvent,
    OnRampTransactionOnHoldComplianceEvent,
    OnRampTransactionOnHoldKycEvent,
    OnRampTransactionOutsideTransferInReviewEvent,
    OnRampTransactionTransferApprovedEvent,
    OnRampTransactionTransferReceivedEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { ImperativeError } from '@zeal/domains/Error'
import { CryptoMoney, Money } from '@zeal/domains/Money'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'

// TODO @resetko-zeal do this on parsing level
const getCryptoMoney = ({
    money,
    knownCurrencies,
}: {
    money: Money
    knownCurrencies: KnownCurrencies
}): CryptoMoney => {
    const currency = knownCurrencies[money.currencyId] || null

    if (!currency) {
        throw new ImperativeError(
            `Failed to find currency ${money.currencyId} in the dictionary`
        )
    }

    switch (currency.type) {
        case 'CryptoCurrency':
            return {
                amount: money.amount,
                currency: currency,
            }

        case 'FiatCurrency':
            throw new ImperativeError(
                `FiatCurrency found instead of CryptoCurrency ${currency.id}`
            )

        default:
            return notReachable(currency)
    }
}

type Props = {
    networkMap: NetworkMap
    event:
        | OnRampTransactionFailedEvent
        | OnRampTransactionOnHoldComplianceEvent
        | OnRampTransactionOutsideTransferInReviewEvent
        | OnRampTransactionTransferApprovedEvent
        | OnRampTransactionTransferReceivedEvent
        | OnRampTransactionCryptoTransferIssuedEvent
        | OnRampTransactionOnHoldKycEvent
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
}

export const CryptoPendingSection = ({
    event,
    form,
    knownCurrencies,
    networkMap,
}: Props) => {
    switch (event.type) {
        case 'unblock_onramp_failed':
        case 'unblock_onramp_transfer_on_hold_compliance':
        case 'unblock_onramp_transfer_in_review':
        case 'unblock_onramp_transfer_approved':
        case 'unblock_onramp_transfer_received':
        case 'unblock_onramp_transfer_on_hold_kyc': {
            const cryptoCurrency = form.outputCurrency
            const network = networkMap[cryptoCurrency.networkHexChainId] || null
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
                                    id="MonitorOnRamp.to"
                                    defaultMessage="To"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <ListItem
                        aria-current={false}
                        size="large"
                        primaryText={form.outputCurrency.code}
                        avatar={({ size }) => (
                            <Avatar
                                rightBadge={({ size }) =>
                                    network && (
                                        <Badge network={network} size={size} />
                                    )
                                }
                                size={size}
                                currency={form.outputCurrency}
                            />
                        )}
                        side={{
                            rightIcon: ({ size }) => (
                                <Spinner
                                    size={size}
                                    color="iconStatusNeutral"
                                />
                            ),
                        }}
                    />
                </Section>
            )
        }
        case 'unblock_onramp_crypto_transfer_issued':
            const cryptoMoney = getCryptoMoney({
                money: event.crypto,
                knownCurrencies,
            })
            const network =
                networkMap[cryptoMoney.currency.networkHexChainId] || null
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
                                    id="MonitorOnRamp.to"
                                    defaultMessage="To"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <ListItem
                        aria-current={false}
                        size="large"
                        primaryText={cryptoMoney.currency.code}
                        avatar={({ size }) => (
                            <Avatar
                                rightBadge={({ size }) =>
                                    network && (
                                        <Badge network={network} size={size} />
                                    )
                                }
                                size={size}
                                currency={cryptoMoney.currency}
                            />
                        )}
                        side={{
                            title: (
                                <>
                                    +
                                    <FormattedTokenBalances
                                        money={event.crypto}
                                        knownCurrencies={knownCurrencies}
                                    />
                                </>
                            ),
                            rightIcon: ({ size }) => (
                                <Spinner
                                    size={size}
                                    color="iconStatusNeutral"
                                />
                            ),
                        }}
                    />
                </Section>
            )

        default:
            return notReachable(event)
    }
}
