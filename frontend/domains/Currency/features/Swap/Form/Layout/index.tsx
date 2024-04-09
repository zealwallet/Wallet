import { FormattedMessage, useIntl } from 'react-intl'

import { Big } from 'big.js'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ActionBarAccountIndicator } from '@zeal/domains/Account/components/ActionBarAccountIndicator'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from '@zeal/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

import { ErrorMessage } from './ErrorMessage'
import { Route } from './Route'

import { getRoute, validate } from '../validation'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_select_network_click' }
    | { type: 'on_to_currency_click' }
    | { type: 'on_from_currency_click' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_swap_continue_clicked'; route: SwapRoute }
    | { type: 'on_try_again_clicked' }
    | MsgOf<typeof Route>

export const Layout = ({ pollable, networkMap, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const validationResult = validate({ pollable })
    const formatTokenBalance = useFormatTokenBalance()

    const errors = validate({ pollable }).getFailureReason() || {}

    const { fromCurrency, portfolio, toCurrency } = pollable.params

    const knownCurrencies = pollable.data.knownCurrencies

    const route: SwapRoute | null = getRoute(pollable)

    const toAmount =
        route && toCurrency
            ? formatTokenBalance({
                  money: { amount: route.toAmount, currencyId: toCurrency.id },
                  knownCurrencies,
              })
            : null

    const fromToken =
        portfolio.tokens.find(
            (token) => token.balance.currencyId === fromCurrency.id
        ) || null

    const fromAmountInDefaultCurrency: Money | null =
        fromToken?.rate && pollable.params.amount
            ? applyRate(
                  {
                      amount: amountToBigint(
                          pollable.params.amount,
                          fromCurrency.fraction
                      ),
                      currencyId: fromCurrency.id,
                  },
                  fromToken.rate,
                  knownCurrencies
              )
            : null

    const networkSelector = (
        <FancyButton
            fill
            rounded={false}
            network={findNetworkByHexChainId(
                fromCurrency.networkHexChainId,
                networkMap
            )}
            onClick={() =>
                onMsg({
                    type: 'on_select_network_click',
                })
            }
        />
    )

    return (
        <Screen background="light" padding="form">
            <Column spacing={0} fill>
                <ActionBar
                    top={
                        <ActionBarAccountIndicator
                            account={pollable.params.fromAccount}
                        />
                    }
                    left={
                        <Clickable onClick={() => onMsg({ type: 'close' })}>
                            <Row spacing={4}>
                                <BackIcon size={24} color="iconDefault" />
                                <ActionBar.Header>
                                    <FormattedMessage
                                        id="currency.swap.header"
                                        defaultMessage="Swap"
                                    />
                                </ActionBar.Header>
                            </Row>
                        </Clickable>
                    }
                />

                <Column spacing={12} fill>
                    <Column spacing={4}>
                        <AmountInput
                            top={networkSelector}
                            content={{
                                topLeft: (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_from_currency_click',
                                            })
                                        }}
                                    >
                                        {({ color }) => (
                                            <Row spacing={4}>
                                                <CurrencyAvatar
                                                    key={fromCurrency.id}
                                                    rightBadge={() => null}
                                                    currency={fromCurrency}
                                                    size={24}
                                                />
                                                <Text
                                                    variant="title3"
                                                    color="textPrimary"
                                                    weight="medium"
                                                >
                                                    {fromCurrency.code}
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
                                        onBlur={onBlur}
                                        onFocus={onFocus}
                                        onChange={(value) =>
                                            onMsg({
                                                type: 'on_amount_change',
                                                amount: value,
                                            })
                                        }
                                        label={formatMessage({
                                            id: 'currency.swap.amount_to_swap',
                                            defaultMessage: 'Amount to swap',
                                        })}
                                        prefix=""
                                        fraction={fromCurrency.fraction}
                                        autoFocus
                                        amount={pollable.params.amount || null}
                                        onSubmitEditing={noop}
                                    />
                                ),
                                bottomRight: fromAmountInDefaultCurrency && (
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedTokenBalanceInDefaultCurrency
                                            knownCurrencies={
                                                pollable.data.knownCurrencies
                                            }
                                            money={fromAmountInDefaultCurrency}
                                        />
                                    </Text>
                                ),
                                bottomLeft: fromToken && (
                                    <Tertiary
                                        color={
                                            errors.fromToken?.type ===
                                            'not_enough_balance'
                                                ? 'critical'
                                                : 'on_light'
                                        }
                                        size="regular"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_amount_change',
                                                amount: Big(
                                                    fromToken.balance.amount.toString(
                                                        10
                                                    )
                                                )
                                                    .div(
                                                        Big(10).pow(
                                                            fromCurrency.fraction
                                                        )
                                                    )
                                                    .toFixed(
                                                        fromCurrency.fraction
                                                    ),
                                            })
                                        }}
                                    >
                                        {({
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
                                                    id="currency.swap.max_label"
                                                    defaultMessage="Balance {amount}"
                                                    values={{
                                                        amount: (
                                                            <FormattedTokenBalances
                                                                money={
                                                                    fromToken.balance
                                                                }
                                                                knownCurrencies={
                                                                    pollable
                                                                        .data
                                                                        .knownCurrencies
                                                                }
                                                            />
                                                        ),
                                                    }}
                                                />
                                            </Text>
                                        )}
                                    </Tertiary>
                                ),
                            }}
                            state={errors.fromToken ? 'error' : 'normal'}
                        />

                        <NextStepSeparator />

                        <AmountInput
                            top={networkSelector}
                            content={{
                                topRight: ({ onBlur, onFocus }) => (
                                    <AmountInput.Input
                                        onBlur={onBlur}
                                        onFocus={onFocus}
                                        label={formatMessage({
                                            id: 'currency.swap.destination_amount',
                                            defaultMessage:
                                                'Destination amount',
                                        })}
                                        prefix=""
                                        readOnly
                                        onChange={noop}
                                        amount={toAmount}
                                        fraction={toCurrency?.fraction ?? 0}
                                        onSubmitEditing={noop}
                                    />
                                ),
                                topLeft: (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_to_currency_click',
                                            })
                                        }}
                                    >
                                        {({ color }) => (
                                            <Row spacing={4}>
                                                {toCurrency ? (
                                                    <>
                                                        <CurrencyAvatar
                                                            key={toCurrency.id}
                                                            currency={
                                                                toCurrency
                                                            }
                                                            size={24}
                                                            rightBadge={() =>
                                                                null
                                                            }
                                                        />
                                                        <Text
                                                            variant="title3"
                                                            color="textPrimary"
                                                            weight="medium"
                                                        >
                                                            {toCurrency.code}
                                                        </Text>
                                                        <LightArrowDown2
                                                            size={18}
                                                            color={color}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Avatar size={24}>
                                                            <QuestionCircle
                                                                size={24}
                                                                color={color}
                                                            />
                                                        </Avatar>
                                                        <Text
                                                            variant="title3"
                                                            color="textPrimary"
                                                            weight="medium"
                                                        >
                                                            <FormattedMessage
                                                                id="currency.swap.select_to_token"
                                                                defaultMessage="Select token"
                                                            />
                                                        </Text>
                                                        <LightArrowDown2
                                                            size={18}
                                                            color={color}
                                                        />
                                                    </>
                                                )}
                                            </Row>
                                        )}
                                    </IconButton>
                                ),
                                bottomRight: route?.priceInDefaultCurrency && (
                                    <Text
                                        variant="footnote"
                                        color="textSecondary"
                                        weight="regular"
                                    >
                                        <FormattedTokenBalanceInDefaultCurrency
                                            knownCurrencies={
                                                pollable.data.knownCurrencies
                                            }
                                            money={route.priceInDefaultCurrency}
                                        />
                                    </Text>
                                ),
                            }}
                            state="normal"
                        />
                    </Column>

                    <Spacer />

                    <Route pollable={pollable} onMsg={onMsg} />

                    <Actions>
                        <Button
                            variant="primary"
                            size="regular"
                            disabled={!!errors.submit}
                            onClick={() => {
                                switch (validationResult.type) {
                                    case 'Failure':
                                        break
                                    case 'Success':
                                        onMsg({
                                            type: 'on_swap_continue_clicked',
                                            route: validationResult.data,
                                        })
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(validationResult)
                                }
                            }}
                        >
                            {(() => {
                                switch (validationResult.type) {
                                    case 'Failure':
                                        return (
                                            <ErrorMessage
                                                error={
                                                    validationResult.reason
                                                        .submit
                                                }
                                            />
                                        )
                                    case 'Success':
                                        return (
                                            <FormattedMessage
                                                id="action.continue"
                                                defaultMessage="Continue"
                                            />
                                        )
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(validationResult)
                                }
                            })()}
                        </Button>
                    </Actions>
                </Column>
            </Column>
        </Screen>
    )
}
