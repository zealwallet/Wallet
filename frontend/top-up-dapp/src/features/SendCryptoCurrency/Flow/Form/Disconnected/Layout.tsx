import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { OutlineWallet } from '@zeal/uikit/Icon/OutlineWallet'
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
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { FancyButton as NetworkFancyButton } from '@zeal/domains/Network/components/FancyButton'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'

import { ConnectionState } from '../ConnectionState'
import { Form } from '../validation'

type Props = {
    pollable: PollableData<{ rate: FXRate; currencies: KnownCurrencies }, Form>
    zealAccount: Account
    connectionState: Extract<
        ConnectionState,
        { type: 'disconnected' | 'connecting' | 'reconnecting' }
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_connect_wallet_clicked' }
    | { type: 'on_crypto_currency_selector_clicked' }
    | { type: 'on_form_change'; form: Form }

export const Layout = ({
    onMsg,
    pollable,
    zealAccount,
    connectionState,
}: Props) => {
    const { formatMessage } = useIntl()
    const form = pollable.params

    const network = PREDEFINED_NETWORKS.find(
        (network) => network.hexChainId === form.currency.networkHexChainId
    )

    if (!network) {
        throw new ImperativeError(
            `Network not found in Disconnected form for hexChainId ${form.currency.networkHexChainId}`
        )
    }

    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <OutlineWallet size={24} color="textSecondary" />
                        <Text
                            variant="paragraph"
                            color="textSecondary"
                            weight="medium"
                        >
                            <FormattedMessage
                                id="send_crypto.form.disconnected.action-bar"
                                defaultMessage="Connect wallet"
                            />
                        </Text>
                    </Row>
                }
                left={
                    <Text
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        <FormattedMessage
                            id="send_crypto.form.disconnected.title"
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
                                onSubmitEditing={() =>
                                    onMsg({ type: 'on_connect_wallet_clicked' })
                                }
                            />
                        ),
                        bottomRight: (() => {
                            switch (pollable.type) {
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
                                        pollable.data.rate,
                                        pollable.data.currencies
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
                                                    pollable.data.currencies
                                                }
                                            />
                                        </Text>
                                    )
                                case 'error':
                                    return null
                                /* istanbul ignore next */
                                default:
                                    return notReachable(pollable)
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
                    switch (connectionState.type) {
                        case 'disconnected':
                            return (
                                <Button
                                    variant="primary"
                                    size="regular"
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_connect_wallet_clicked',
                                        })
                                    }
                                >
                                    <FormattedMessage
                                        id="send_crypto.form.disconnected.cta.disconnected"
                                        defaultMessage="Connect wallet"
                                    />
                                </Button>
                            )
                        case 'connecting':
                        case 'reconnecting':
                            return (
                                <Button
                                    disabled
                                    variant="primary"
                                    size="regular"
                                >
                                    <FormattedMessage
                                        id="send_crypto.form.disconnected.cta.connecting"
                                        defaultMessage="Connecting to wallet..."
                                    />
                                </Button>
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(connectionState.type)
                    }
                })()}
            </Actions>
        </Screen>
    )
}
