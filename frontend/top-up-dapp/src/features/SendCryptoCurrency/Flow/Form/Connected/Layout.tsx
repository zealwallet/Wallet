import { FormattedMessage, useIntl } from 'react-intl'

import { useDisconnect } from 'wagmi'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { DisconnectWallet } from '@zeal/uikit/Icon/DisconnectWallet'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { IconButton } from '@zeal/uikit/IconButton'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { ListItem } from '@zeal/uikit/ListItem'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge } from '@zeal/domains/Account/components/Avatar'
import { format } from '@zeal/domains/Address/helpers/format'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkHexId } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { FancyButton as NetworkFancyButton } from '@zeal/domains/Network/components/FancyButton'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'

import { ConnectionState } from 'src/features/SendCryptoCurrency/Flow/Form/ConnectionState'

import { ExternalWalletAvatar } from '../../../components/ExternalWalletAvatar'
import { TopUpRequest } from '../../TopUpRequest'
import { Form, validateAsYouType } from '../validation'

type Props = {
    connectionState: Extract<
        ConnectionState,
        { type: 'connected' | 'connected_to_unsupported_network' }
    >
    portfolioLoadable: LoadableData<Portfolio, unknown>
    ratePollable: PollableData<
        { rate: FXRate; currencies: KnownCurrencies },
        Form
    >
    zealAccount: Account
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'on_form_submitted'
          topUpRequest: TopUpRequest
          knownCurrencies: KnownCurrencies | null
      }
    | { type: 'on_crypto_currency_selector_clicked' }
    | {
          type: 'on_connect_to_correct_network_clicked'
          networkHexId: NetworkHexId
      }
    | { type: 'on_form_change'; form: Form }

export const Layout = ({
    connectionState,
    portfolioLoadable,
    ratePollable,
    zealAccount,
    onMsg,
}: Props) => {
    const { disconnect } = useDisconnect()
    const errors =
        validateAsYouType({
            fromAccount: connectionState.account,
            portfolioLoadable,
            ratePollable,
            zealAccount,
            form: ratePollable.params,
            connectionState,
        }).getFailureReason() || {}

    const { formatMessage } = useIntl()
    const form = ratePollable.params

    const network = PREDEFINED_NETWORKS.find(
        (network) => network.hexChainId === form.currency.networkHexChainId
    )

    if (!network) {
        throw new ImperativeError(
            `Network not found in Connected form for hexChainId ${form.currency.networkHexChainId}`
        )
    }

    const handleFormSubmit = () => {
        const result = validateAsYouType({
            fromAccount: connectionState.account,
            portfolioLoadable,
            ratePollable,
            zealAccount,
            form: ratePollable.params,
            connectionState,
        })

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_form_submitted',
                    topUpRequest: result.data.topUpRequest,
                    knownCurrencies: result.data.knownCurrencies,
                })
                break

            default:
                notReachable(result)
        }
    }

    return (
        <Screen padding="form" background="light">
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <ExternalWalletAvatar
                            fromAccount={connectionState.account}
                            size={24}
                        />

                        <Text
                            variant="paragraph"
                            weight="medium"
                            color="textSecondary"
                        >
                            {format(connectionState.account.address)}
                        </Text>
                        <IconButton
                            variant="on_light"
                            onClick={() => disconnect()}
                        >
                            {({ color }) => (
                                <DisconnectWallet size={18} color={color} />
                            )}
                        </IconButton>
                    </Row>
                }
                left={
                    <Text
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="topup.addFundsToZeal"
                            defaultMessage="Add funds to Zeal"
                        />
                    </Text>
                }
            />
            <Column spacing={4}>
                <AmountInput
                    state="normal"
                    top={
                        <NetworkFancyButton
                            fill
                            rounded={false}
                            network={network}
                            onClick={() =>
                                onMsg({
                                    type: 'on_crypto_currency_selector_clicked',
                                })
                            }
                        />
                    }
                    content={{
                        topLeft: (
                            <IconButton
                                variant="on_light"
                                onClick={() => {
                                    onMsg({
                                        type: 'on_crypto_currency_selector_clicked',
                                    })
                                }}
                            >
                                {() => (
                                    <Row spacing={4}>
                                        <CurrencyAvatar
                                            key={form.currency.id}
                                            currency={form.currency}
                                            size={24}
                                            rightBadge={({ size }) => (
                                                <Avatar
                                                    size={size}
                                                    currentNetwork={{
                                                        type: 'specific_network',
                                                        network,
                                                    }}
                                                />
                                            )}
                                        />
                                        <Text
                                            variant="title3"
                                            color="textPrimary"
                                            weight="medium"
                                        >
                                            {form.currency.code}
                                        </Text>
                                        <LightArrowDown2
                                            size={18}
                                            color="iconDefault"
                                        />
                                    </Row>
                                )}
                            </IconButton>
                        ),
                        topRight: ({ onBlur, onFocus }) => (
                            <AmountInput.Input
                                onBlur={onBlur}
                                onFocus={onFocus}
                                label={formatMessage({
                                    id: 'send_crypto.form.disconnected.label',
                                    defaultMessage: 'Amount to transfer',
                                })}
                                amount={form.amount}
                                fraction={form.currency.fraction}
                                onChange={(value) =>
                                    onMsg({
                                        type: 'on_form_change',
                                        form: {
                                            ...form,
                                            amount: value,
                                        },
                                    })
                                }
                                prefix=""
                                autoFocus
                                onSubmitEditing={handleFormSubmit}
                            />
                        ),
                        bottomRight: (() => {
                            switch (ratePollable.type) {
                                case 'loading':
                                    return (
                                        <Skeleton
                                            variant="default"
                                            width={40}
                                            height={16}
                                        />
                                    )
                                case 'loaded':
                                case 'subsequent_failed':
                                case 'reloading':
                                    const tokenAmount: Money = {
                                        amount: amountToBigint(
                                            form.amount,
                                            form.currency.fraction
                                        ),
                                        currencyId: form.currency.id,
                                    }

                                    const amountInDefaultCurrency = applyRate(
                                        tokenAmount,
                                        ratePollable.data.rate,
                                        ratePollable.data.currencies
                                    )
                                    return (
                                        <Text
                                            color="textSecondary"
                                            variant="footnote"
                                            weight="regular"
                                        >
                                            <FormattedTokenBalanceInDefaultCurrency
                                                money={amountInDefaultCurrency}
                                                knownCurrencies={
                                                    ratePollable.data.currencies
                                                }
                                            />
                                        </Text>
                                    )
                                case 'error':
                                    return null
                                /* istanbul ignore next */
                                default:
                                    return notReachable(ratePollable)
                            }
                        })(),
                        bottomLeft: (() => {
                            switch (portfolioLoadable.type) {
                                case 'loading':
                                    return (
                                        <Skeleton
                                            variant="default"
                                            width={40}
                                            height={16}
                                        />
                                    )
                                case 'loaded':
                                    const balance =
                                        portfolioLoadable.data.tokens.find(
                                            (token) =>
                                                token.balance.currencyId ===
                                                form.currency.id
                                        )?.balance || null

                                    return balance ? (
                                        <Text
                                            color={
                                                errors.balance
                                                    ? 'textError'
                                                    : 'textSecondary'
                                            }
                                            variant="footnote"
                                            weight="regular"
                                        >
                                            <FormattedMessage
                                                id="currency.swap.max_label"
                                                defaultMessage="Balance {amount}"
                                                values={{
                                                    amount: (
                                                        <FormattedTokenBalances
                                                            money={balance}
                                                            knownCurrencies={
                                                                portfolioLoadable
                                                                    .data
                                                                    .currencies
                                                            }
                                                        />
                                                    ),
                                                }}
                                            />
                                        </Text>
                                    ) : null

                                case 'error':
                                    return null
                                /* istanbul ignore next */
                                default:
                                    return notReachable(portfolioLoadable)
                            }
                        })(),
                    }}
                />
                <NextStepSeparator />

                <Group variant="default">
                    <ListItem
                        aria-current={false}
                        size="large"
                        primaryText={zealAccount.label}
                        shortText={format(zealAccount.address)}
                        avatar={({ size }) => (
                            <AvatarWithoutBadge
                                account={zealAccount}
                                size={size}
                            />
                        )}
                    />
                </Group>
            </Column>

            <Spacer />

            <Actions>
                {(() => {
                    if (!errors.submit) {
                        return (
                            <Button
                                variant="primary"
                                size="regular"
                                onClick={handleFormSubmit}
                            >
                                <FormattedMessage
                                    id="send_crypto.form.disconnected.cta.addFunds"
                                    defaultMessage="Add funds"
                                />
                            </Button>
                        )
                    }

                    switch (errors.submit.type) {
                        case 'insufficient_balance':
                        case 'amount_requred':
                            return (
                                <Button
                                    variant="primary"
                                    size="regular"
                                    disabled
                                >
                                    <FormattedMessage
                                        id="send_crypto.form.disconnected.cta.addFunds"
                                        defaultMessage="Add funds"
                                    />
                                </Button>
                            )

                        case 'connected_to_unsupported_network':
                            return (
                                <Button
                                    variant="primary"
                                    size="regular"
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_connect_to_correct_network_clicked',
                                            networkHexId: network.hexChainId,
                                        })
                                    }
                                >
                                    <FormattedMessage
                                        id="send_crypto.form.disconnected.cta.connectToSelectedNetwork"
                                        defaultMessage="Connect to {network}"
                                        values={{ network: network.name }}
                                    />
                                </Button>
                            )

                        default:
                            return notReachable(errors.submit)
                    }
                })()}
            </Actions>
        </Screen>
    )
}
