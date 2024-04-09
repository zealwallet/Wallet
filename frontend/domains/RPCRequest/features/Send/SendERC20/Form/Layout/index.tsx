import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CustomAccountAddress } from '@zeal/uikit/Icon/CustomAccountAddress'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { IconButton } from '@zeal/uikit/IconButton'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { ListItem } from '@zeal/uikit/ListItem'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { Address } from '@zeal/domains/Address'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FXRate } from '@zeal/domains/FXRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Money } from '@zeal/domains/Money'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { Token } from '@zeal/domains/Token'
import { Avatar as TokenAvatar } from '@zeal/domains/Token/components/Avatar'

import { BalanceButton } from './BalanceButton'
import { SecondaryAmountButton } from './SecondaryAmountButton'
import { ToAddress } from './ToAddress'

import { validate } from '../validation'

type Props = {
    form: Form
    installationId: string
    knownCurrencies: KnownCurrencies
    accountsMap: AccountsMap
    fxRate: FXRate | null
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    account: Account
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'on_select_token'
      }
    | {
          type: 'on_select_to_address'
      }
    | {
          type: 'on_submit_form'
          request: EthSendTransaction
          network: Network
          form: Form
      }
    | {
          type: 'on_form_change'
          form: Form
      }

export type Form =
    | {
          type: 'amount_in_tokens'
          token: Token
          amount: string | null
          toAddress: Address | null
      }
    | {
          type: 'amount_in_default_currency'
          token: Token
          amount: string | null
          fxRate: FXRate
          priceInDefaultCurrency: Money
          toAddress: Address | null
      }

const getPrefix = (form: Form): string => {
    switch (form.type) {
        case 'amount_in_tokens':
            return ''
        case 'amount_in_default_currency':
            return '$'
        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}

export const Layout = ({
    form,
    knownCurrencies,
    networkMap,
    networkRPCMap,
    account,
    fxRate,
    accountsMap,
    keyStoreMap,
    installationId,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const errors =
        validate({
            form,
            networkRPCMap,
            networkMap,
            account,
            knownCurrencies,
        }).getFailureReason() || {}

    const prefix = getPrefix(form)

    const onSubmit = () => {
        const result = validate({
            account,
            form,
            knownCurrencies,
            networkRPCMap,
            networkMap,
        })

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_submit_form',
                    request: result.data.request,
                    network: result.data.network,
                    form: form,
                })
                break

            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen padding="form" background="light">
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="send_token.form.title"
                                    defaultMessage="Send"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />

            <Column spacing={16} shrink alignY="stretch">
                <Column spacing={16}>
                    <Column spacing={4}>
                        <AmountInput
                            content={{
                                topLeft: (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_select_token',
                                            })
                                        }}
                                    >
                                        {({ color }) => (
                                            <Row spacing={4}>
                                                <TokenAvatar
                                                    key={
                                                        form.token.balance
                                                            .currencyId
                                                    }
                                                    token={form.token}
                                                    knownCurrencies={
                                                        knownCurrencies
                                                    }
                                                    size={24}
                                                    rightBadge={(
                                                        (token: Token) =>
                                                        ({ size }) =>
                                                            (
                                                                <Badge
                                                                    size={size}
                                                                    network={findNetworkByHexChainId(
                                                                        token.networkHexId,
                                                                        networkMap
                                                                    )}
                                                                />
                                                            )
                                                    )(form.token)}
                                                />
                                                <Text
                                                    variant="title3"
                                                    color="textPrimary"
                                                    weight="medium"
                                                >
                                                    {
                                                        knownCurrencies[
                                                            form.token.balance
                                                                .currencyId
                                                        ].code
                                                    }
                                                </Text>
                                                <LightArrowDown2
                                                    size={18}
                                                    color={color}
                                                />
                                            </Row>
                                        )}
                                    </IconButton>
                                ),
                                topRight: ({ onBlur, onFocus }) => (
                                    <AmountInput.Input
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        label={formatMessage({
                                            id: 'send_token.form.send-amount',
                                            defaultMessage: 'Send amount',
                                        })}
                                        fraction={
                                            knownCurrencies[
                                                form.token.balance.currencyId
                                            ].fraction
                                        }
                                        autoFocus
                                        readOnly={false}
                                        prefix={prefix}
                                        amount={form.amount}
                                        onChange={(value) => {
                                            onMsg({
                                                type: 'on_form_change',
                                                form: {
                                                    ...form,
                                                    amount: value,
                                                },
                                            })
                                        }}
                                        onSubmitEditing={onSubmit}
                                    />
                                ),
                                bottomLeft: (
                                    <BalanceButton
                                        state={
                                            errors.amount ? 'error' : 'normal'
                                        }
                                        networkMap={networkMap}
                                        networkRPCMap={networkRPCMap}
                                        knownCurrencies={knownCurrencies}
                                        account={account}
                                        token={form.token}
                                        onClick={(maxAmount) =>
                                            onMsg({
                                                type: 'on_form_change',
                                                form: {
                                                    ...form,
                                                    type: 'amount_in_tokens',
                                                    amount: maxAmount,
                                                },
                                            })
                                        }
                                    />
                                ),
                                bottomRight: fxRate &&
                                    form.token.priceInDefaultCurrency && (
                                        <SecondaryAmountButton
                                            form={form}
                                            fxRate={fxRate}
                                            knownCurrencies={knownCurrencies}
                                            onClick={(
                                                (
                                                    token,
                                                    priceInDefaultCurrency
                                                ) =>
                                                (amount) => {
                                                    switch (form.type) {
                                                        case 'amount_in_tokens':
                                                            onMsg({
                                                                type: 'on_form_change',
                                                                form: {
                                                                    ...form,
                                                                    type: 'amount_in_default_currency',
                                                                    token,
                                                                    amount,
                                                                    fxRate,
                                                                    priceInDefaultCurrency,
                                                                },
                                                            })
                                                            break
                                                        case 'amount_in_default_currency':
                                                            onMsg({
                                                                type: 'on_form_change',
                                                                form: {
                                                                    ...form,
                                                                    type: 'amount_in_tokens',
                                                                    amount,
                                                                },
                                                            })
                                                            break
                                                        /* istanbul ignore next */
                                                        default:
                                                            return notReachable(
                                                                form
                                                            )
                                                    }
                                                }
                                            )(
                                                form.token,
                                                form.token
                                                    .priceInDefaultCurrency
                                            )}
                                        />
                                    ),
                            }}
                            state={errors.amount ? 'error' : 'normal'}
                        />

                        <NextStepSeparator />

                        <Group variant="default">
                            {form.toAddress ? (
                                <ToAddress
                                    installationId={installationId}
                                    address={form.toAddress}
                                    keyStoreMap={keyStoreMap}
                                    accountsMap={accountsMap}
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_select_to_address',
                                        })
                                    }
                                />
                            ) : (
                                <ListItem
                                    size="large"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <Avatar
                                            size={size}
                                            border="borderSecondary"
                                        >
                                            <CustomAccountAddress
                                                size={24}
                                                color="iconDefault"
                                            />
                                        </Avatar>
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="send_token.form.select-address"
                                            defaultMessage="Select address"
                                        />
                                    }
                                    side={{
                                        rightIcon: ({ size }) => (
                                            <LightArrowDown2
                                                size={size}
                                                color="iconDefault"
                                            />
                                        ),
                                    }}
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_select_to_address',
                                        })
                                    }
                                />
                            )}
                        </Group>
                    </Column>
                </Column>

                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        disabled={!!errors.submit}
                        onClick={onSubmit}
                    >
                        <FormattedMessage
                            id="actions.continue"
                            defaultMessage="Continue"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
