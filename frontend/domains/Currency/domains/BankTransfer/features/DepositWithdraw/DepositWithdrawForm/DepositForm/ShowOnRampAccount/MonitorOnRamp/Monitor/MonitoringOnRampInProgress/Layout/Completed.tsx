import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { BannerSolid } from '@zeal/uikit/BannerSolid'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Divider } from '@zeal/uikit/Divider'
import { GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldTickRound } from '@zeal/uikit/Icon/BoldTickRound'
import { CheckMarkCircle } from '@zeal/uikit/Icon/CheckMarkCircle'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { ListItem } from '@zeal/uikit/ListItem'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { OnRampTransactionProcessCompletedEvent } from '@zeal/domains/Currency/domains/BankTransfer'
import { ImperativeError } from '@zeal/domains/Error'
import { CryptoMoney, FiatMoney, Money } from '@zeal/domains/Money'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { format } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/format'
import { getExplorerLink } from '@zeal/domains/Transactions/domains/TransactionHash/helpers/getExplorerLink'

import { FiatCompletedSection } from './FiatCompletedSection'

type Props = {
    event: OnRampTransactionProcessCompletedEvent
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_on_ramp_transfer_success_close_click'
    event: OnRampTransactionProcessCompletedEvent
}

type State = { type: 'success_animation' } | { type: 'final_screen' }

export const Completed = ({
    event,
    knownCurrencies,
    onMsg,
    networkMap,
}: Props) => {
    const { formatMessage } = useIntl()
    const [state, setState] = useState<State>({ type: 'success_animation' })

    const { transactionHash, fiat, crypto } = event

    const fiatMoney = getFiatMoney({ money: fiat, knownCurrencies })
    const cryptoMoney = getCryptoMoney({ money: crypto, knownCurrencies })
    const network = networkMap[cryptoMoney.currency.networkHexChainId] || null
    const link = network ? getExplorerLink({ transactionHash }, network) : null

    return (
        <>
            <Content
                header={
                    <Content.Header
                        title={
                            <FormattedMessage
                                id="currency.bankTransfer.deposit_status.title"
                                defaultMessage="Deposit"
                            />
                        }
                    />
                }
                footer={
                    <Column spacing={0}>
                        <Progress
                            variant="success"
                            title={
                                <FormattedMessage
                                    id="currency.bankTransfer.deposit_status.finished.title"
                                    defaultMessage="You've received {crypto}"
                                    values={{
                                        crypto: cryptoMoney.currency.code,
                                    }}
                                />
                            }
                            right={
                                <Row spacing={4}>
                                    <CheckMarkCircle
                                        size={16}
                                        color="iconStatusSuccessOnColor"
                                    />
                                    {link && (
                                        <Tertiary
                                            size="regular"
                                            color="success"
                                            onClick={() =>
                                                openExternalURL(link)
                                            }
                                        >
                                            {({
                                                color,
                                                textVariant,
                                                textWeight,
                                            }) => (
                                                <Row
                                                    spacing={4}
                                                    alignY="center"
                                                >
                                                    <Text
                                                        variant={textVariant}
                                                        weight={textWeight}
                                                        color={color}
                                                    >
                                                        {format({
                                                            transactionHash,
                                                        })}
                                                    </Text>

                                                    <ExternalLink
                                                        size={14}
                                                        color={color}
                                                    />
                                                </Row>
                                            )}
                                        </Tertiary>
                                    )}
                                </Row>
                            }
                            initialProgress={70}
                            progress={100}
                        />

                        <Divider variant="default" />

                        <BannerSolid
                            variant="success"
                            title={null}
                            subtitle={
                                <FormattedMessage
                                    id="currency.bankTransfer.deposit_status.finished.subtitle"
                                    defaultMessage="Your bank transfer has successfully transferred {fiat} to {crypto}."
                                    values={{
                                        fiat: fiatMoney.currency.code,
                                        crypto: cryptoMoney.currency.code,
                                    }}
                                />
                            }
                        />
                    </Column>
                }
            >
                {(() => {
                    switch (state.type) {
                        case 'success_animation':
                            return (
                                <Content.Splash
                                    onAnimationComplete={() =>
                                        setState({ type: 'final_screen' })
                                    }
                                    variant="success"
                                    title={
                                        <FormattedMessage
                                            id="currency.bankTransfer.deposit_status.success"
                                            defaultMessage="Received in your wallet"
                                        />
                                    }
                                />
                            )

                        case 'final_screen':
                            return (
                                <Column spacing={16}>
                                    <FiatCompletedSection
                                        event={event}
                                        knownCurrencies={knownCurrencies}
                                    />

                                    <Section>
                                        <GroupHeader
                                            left={({
                                                color,
                                                textVariant,
                                                textWeight,
                                            }) => (
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
                                            primaryText={
                                                cryptoMoney.currency.code
                                            }
                                            avatar={({ size }) => (
                                                <Avatar
                                                    rightBadge={({ size }) =>
                                                        network && (
                                                            <Badge
                                                                network={
                                                                    network
                                                                }
                                                                size={size}
                                                            />
                                                        )
                                                    }
                                                    size={size}
                                                    currency={
                                                        cryptoMoney.currency
                                                    }
                                                />
                                            )}
                                            side={{
                                                title: (
                                                    <>
                                                        +
                                                        <FormattedTokenBalances
                                                            money={event.crypto}
                                                            knownCurrencies={
                                                                knownCurrencies
                                                            }
                                                        />
                                                    </>
                                                ),
                                                rightIcon: ({ size }) => (
                                                    <BoldTickRound
                                                        aria-label={formatMessage(
                                                            {
                                                                id: 'on_ramp.crypto_completed',
                                                                defaultMessage:
                                                                    'Completed',
                                                            }
                                                        )}
                                                        size={size}
                                                        color="iconStatusSuccess"
                                                    />
                                                ),
                                            }}
                                        />
                                    </Section>
                                </Column>
                            )

                        default:
                            return notReachable(state)
                    }
                })()}
            </Content>
            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_on_ramp_transfer_success_close_click',
                            event,
                        })
                    }
                >
                    <FormattedMessage
                        id="actions.close"
                        defaultMessage="Close"
                    />
                </Button>
            </Actions>
        </>
    )
}

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
