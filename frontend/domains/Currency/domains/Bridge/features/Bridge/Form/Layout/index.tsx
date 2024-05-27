import { FormattedMessage, useIntl } from 'react-intl'

import Big from 'big.js'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { FancyButton } from '@zeal/uikit/FancyButton'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { SolidInterfacePlus } from '@zeal/uikit/Icon/SolidInterfacePlus'
import { IconButton } from '@zeal/uikit/IconButton'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import {
    BridgePollable,
    BridgeRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { applyRate } from '@zeal/domains/FXRate/helpers/applyRate'
import { Money } from '@zeal/domains/Money'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import {
    FormattedTokenBalances,
    useFormatTokenBalance,
} from '@zeal/domains/Money/components/FormattedTokenBalances'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton as NetworkFancyButton } from '@zeal/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Portfolio } from '@zeal/domains/Portfolio'

import { ErrorMessage } from './ErrorMessage'
import { Route } from './Route'
import { getBridgeRouteRequest, validateOnSubmit } from './validation'

type Props = {
    portfolio: Portfolio
    pollable: BridgePollable
    currenciesMatrix: CurrenciesMatrix
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_from_network_click' }
    | { type: 'on_to_network_click' }
    | { type: 'on_from_currency_click' }
    | { type: 'on_to_currency_click' }
    | { type: 'on_refuel_add_click' }
    | { type: 'on_refuel_remove_click' }
    | { type: 'on_amount_change'; amount: string | null }
    | { type: 'on_bridge_continue_clicked'; route: BridgeRequest }
    | MsgOf<typeof Route>

export const Layout = ({
    pollable,
    portfolio,
    currenciesMatrix,
    networkMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const formatTokenBalance = useFormatTokenBalance()
    const { fromAccount, fromCurrency, toCurrency, knownCurrencies } =
        pollable.params

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        toCurrency.networkHexChainId,
        networkMap
    )

    const refuelAvailable =
        currenciesMatrix.currencies[fromNetwork.hexChainId]?.[
            toNetwork.hexChainId
        ]?.canRefuel || false

    const validationResult = validateOnSubmit({ pollable, portfolio })
    const errors = validationResult.getFailureReason() || {}

    const bridgeRequest = getBridgeRouteRequest({ pollable })

    const toAmount = bridgeRequest
        ? formatTokenBalance({
              money: bridgeRequest.route.to,
              knownCurrencies,
          })
        : null

    const fromToken =
        (portfolio &&
            portfolio.tokens.find(
                (token) => token.balance.currencyId === fromCurrency.id
            )) ||
        null

    const fromAmountInDefaultCurrency: Money | null =
        fromToken?.rate && pollable.params.fromAmount
            ? applyRate(
                  {
                      amount: amountToBigint(
                          pollable.params.fromAmount,
                          fromCurrency.fraction
                      ),
                      currencyId: fromCurrency.id,
                  },
                  fromToken.rate,
                  knownCurrencies
              )
            : null

    const refuelCurrency =
        (bridgeRequest &&
            values(bridgeRequest.knownCurrencies).find(
                (currency): currency is CryptoCurrency => {
                    switch (currency.type) {
                        case 'FiatCurrency':
                            return false
                        case 'CryptoCurrency':
                            return (
                                currency.address ===
                                    getNativeTokenAddress(toNetwork) &&
                                currency.networkHexChainId ===
                                    toCurrency.networkHexChainId
                            )
                        /* istanbul ignore next */
                        default:
                            return notReachable(currency)
                    }
                }
            )) ||
        null

    const isRefuelAvailable =
        refuelAvailable &&
        refuelCurrency &&
        !pollable.params.refuel &&
        refuelCurrency.id !== toCurrency.id

    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <UIActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={fromAccount} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {fromAccount.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(fromAccount.address)}
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
                                    id="currency.bridge.header"
                                    defaultMessage="Bridge"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />

            <Column spacing={16} fill>
                <Column spacing={12} fill>
                    <ScrollContainer contentFill>
                        <Column spacing={8} fill>
                            <Column spacing={4}>
                                <AmountInput
                                    label={formatMessage({
                                        id: 'currency.bridge.from',
                                        defaultMessage: 'From',
                                    })}
                                    state={
                                        errors.fromToken ? 'error' : 'normal'
                                    }
                                    top={
                                        <NetworkFancyButton
                                            fill
                                            rounded={false}
                                            network={fromNetwork}
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_from_network_click',
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
                                                        type: 'on_from_currency_click',
                                                    })
                                                }}
                                            >
                                                {({ color: _color }) => (
                                                    <Row spacing={4}>
                                                        <CurrencyAvatar
                                                            key={
                                                                fromCurrency.id
                                                            }
                                                            currency={
                                                                fromCurrency
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
                                                            {fromCurrency.code}
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
                                                    id: 'currency.bridge.header',
                                                    defaultMessage:
                                                        'Amount to bridge',
                                                })}
                                                amount={
                                                    pollable.params
                                                        .fromAmount || null
                                                }
                                                fraction={fromCurrency.fraction}
                                                onChange={(value) =>
                                                    onMsg({
                                                        type: 'on_amount_change',
                                                        amount: value,
                                                    })
                                                }
                                                autoFocus
                                                prefix=""
                                                onSubmitEditing={noop}
                                            />
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
                                                                            knownCurrencies
                                                                        }
                                                                    />
                                                                ),
                                                            }}
                                                        />
                                                    </Text>
                                                )}
                                            </Tertiary>
                                        ),
                                        bottomRight:
                                            fromAmountInDefaultCurrency && (
                                                <Text
                                                    variant="footnote"
                                                    color="textSecondary"
                                                    weight="regular"
                                                >
                                                    <FormattedTokenBalanceInDefaultCurrency
                                                        knownCurrencies={
                                                            knownCurrencies
                                                        }
                                                        money={
                                                            fromAmountInDefaultCurrency
                                                        }
                                                    />
                                                </Text>
                                            ),
                                    }}
                                    bottom={
                                        pollable.params.refuel && (
                                            <RefuelFrom
                                                pollable={pollable}
                                                onRemoveRefuelClick={() =>
                                                    onMsg({
                                                        type: 'on_refuel_remove_click',
                                                    })
                                                }
                                            />
                                        )
                                    }
                                />

                                <NextStepSeparator />

                                <AmountInput
                                    label={formatMessage({
                                        id: 'currency.bridge.to',
                                        defaultMessage: 'To',
                                    })}
                                    state="normal"
                                    top={
                                        <NetworkFancyButton
                                            fill
                                            rounded={false}
                                            network={toNetwork}
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_to_network_click',
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
                                                        type: 'on_to_currency_click',
                                                    })
                                                }}
                                            >
                                                {({ color }) => (
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
                                                )}
                                            </IconButton>
                                        ),
                                        topRight: ({ onBlur, onFocus }) =>
                                            (() => {
                                                switch (pollable.type) {
                                                    case 'loading':
                                                    case 'reloading':
                                                        return (
                                                            <AmountInput.InputSkeleton />
                                                        )
                                                    case 'loaded':
                                                    case 'subsequent_failed':
                                                    case 'error':
                                                        return (
                                                            <AmountInput.Input
                                                                onBlur={onBlur}
                                                                onFocus={
                                                                    onFocus
                                                                }
                                                                label={formatMessage(
                                                                    {
                                                                        id: 'currency.swap.destination_amount',
                                                                        defaultMessage:
                                                                            'Destination amount',
                                                                    }
                                                                )}
                                                                amount={
                                                                    toAmount
                                                                }
                                                                fraction={
                                                                    toCurrency.fraction ??
                                                                    0
                                                                }
                                                                onChange={noop}
                                                                prefix=""
                                                                readOnly
                                                                onSubmitEditing={
                                                                    noop
                                                                }
                                                            />
                                                        )
                                                    /* istanbul ignore next */
                                                    default:
                                                        return notReachable(
                                                            pollable
                                                        )
                                                }
                                            })(),
                                        bottomRight: bridgeRequest?.route
                                            .toPriceInDefaultCurrency && (
                                            <Text
                                                variant="footnote"
                                                color="textSecondary"
                                                weight="regular"
                                            >
                                                <FormattedTokenBalanceInDefaultCurrency
                                                    knownCurrencies={
                                                        knownCurrencies
                                                    }
                                                    money={
                                                        bridgeRequest?.route
                                                            .toPriceInDefaultCurrency
                                                    }
                                                />
                                            </Text>
                                        ),
                                    }}
                                    bottom={
                                        pollable.params.refuel && (
                                            <RefuelTo
                                                pollable={pollable}
                                                onRemoveRefuelClick={() =>
                                                    onMsg({
                                                        type: 'on_refuel_remove_click',
                                                    })
                                                }
                                            />
                                        )
                                    }
                                />
                            </Column>

                            {isRefuelAvailable && (
                                <Row spacing={8} alignX="end">
                                    <FancyButton
                                        right={null}
                                        color="secondary"
                                        rounded
                                        left={({
                                            color,
                                            textVariant,
                                            textWeight,
                                        }) => (
                                            <Row spacing={4}>
                                                <SolidInterfacePlus
                                                    size={16}
                                                    color={color}
                                                />
                                                <Text
                                                    color={color}
                                                    variant={textVariant}
                                                    weight={textWeight}
                                                >
                                                    <FormattedMessage
                                                        id="currency.bridge.topup"
                                                        defaultMessage="Top up {symbol}"
                                                        values={{
                                                            symbol: refuelCurrency.symbol,
                                                        }}
                                                    />
                                                </Text>
                                            </Row>
                                        )}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_refuel_add_click',
                                            })
                                        }
                                    />
                                </Row>
                            )}

                            <Spacer />
                            <Route pollable={pollable} onMsg={onMsg} />
                        </Column>
                    </ScrollContainer>
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
                                            type: 'on_bridge_continue_clicked',
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

const RefuelSkeleton = () => (
    <Row spacing={8} alignX="stretch">
        <Skeleton variant="default" width={35} height={16} />
        <Skeleton variant="default" width={55} height={16} />
    </Row>
)
const RefuelFrom = ({
    pollable,
    onRemoveRefuelClick,
}: {
    pollable: BridgePollable
    onRemoveRefuelClick: () => void
}) => {
    const { formatMessage } = useIntl()
    if (!pollable.params.refuel) {
        return null
    }

    switch (pollable.type) {
        case 'loaded': {
            const bridgeRequest = getBridgeRouteRequest({ pollable })

            if (!bridgeRequest) {
                return null
            }

            const refuel = bridgeRequest.route.refuel

            if (!refuel) {
                return null
            }

            const knownCurrencies = bridgeRequest.knownCurrencies
            const currency = knownCurrencies[refuel.from.currencyId]

            return (
                currency && (
                    <Row
                        spacing={8}
                        aria-labelledby="refuel-from-label"
                        aria-describedby="refuel-from-description"
                    >
                        <Row spacing={4}>
                            <CurrencyAvatar
                                rightBadge={() => null}
                                size={20}
                                currency={currency}
                            />

                            <Text
                                id="refuel-from-label"
                                color="textPrimary"
                                variant="paragraph"
                                weight="regular"
                            >
                                {currency.symbol}
                            </Text>
                        </Row>

                        <Spacer />

                        <Text
                            color="textPrimary"
                            variant="paragraph"
                            weight="regular"
                            id="refuel-from-description"
                        >
                            -
                            <FormattedTokenBalances
                                knownCurrencies={knownCurrencies}
                                money={refuel.from}
                            />
                        </Text>

                        <Tertiary
                            color="on_light"
                            size="regular"
                            onClick={onRemoveRefuelClick}
                            aria-label={formatMessage({
                                id: 'bridge.remove_topup',
                                defaultMessage: 'Remove Topup',
                            })}
                        >
                            {({ color }) => (
                                <CloseCross size={20} color={color} />
                            )}
                        </Tertiary>
                    </Row>
                )
            )
        }
        case 'reloading':
        case 'loading':
            return <RefuelSkeleton />

        case 'subsequent_failed':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const RefuelTo = ({
    pollable,
    onRemoveRefuelClick,
}: {
    pollable: BridgePollable
    onRemoveRefuelClick: () => void
}) => {
    const { formatMessage } = useIntl()
    if (!pollable.params.refuel) {
        return null
    }

    switch (pollable.type) {
        case 'loaded': {
            const bridgeRequest = getBridgeRouteRequest({ pollable })

            if (!bridgeRequest) {
                return null
            }

            const refuel = bridgeRequest.route.refuel

            if (!refuel) {
                return null
            }

            const knownCurrencies = bridgeRequest.knownCurrencies
            const currency = knownCurrencies[refuel.to.currencyId]

            return (
                currency && (
                    <Row
                        spacing={8}
                        aria-labelledby="refuel-to-label"
                        aria-describedby="refuel-to-description"
                    >
                        <Row spacing={4}>
                            <CurrencyAvatar
                                rightBadge={() => null}
                                size={20}
                                currency={currency}
                            />

                            <Text
                                color="textPrimary"
                                variant="paragraph"
                                weight="regular"
                                id="refuel-to-label"
                            >
                                {currency.symbol}
                            </Text>
                        </Row>

                        <Spacer />

                        <Text
                            color="textPrimary"
                            variant="paragraph"
                            weight="regular"
                            id="refuel-to-description"
                        >
                            +
                            <FormattedTokenBalances
                                knownCurrencies={knownCurrencies}
                                money={refuel.to}
                            />
                        </Text>

                        <Tertiary
                            color="on_light"
                            size="regular"
                            aria-label={formatMessage({
                                id: 'bridge.remove_topup',
                                defaultMessage: 'Remove Topup',
                            })}
                            onClick={onRemoveRefuelClick}
                        >
                            {({ color }) => (
                                <CloseCross size={20} color={color} />
                            )}
                        </Tertiary>
                    </Row>
                )
            )
        }
        case 'reloading':
        case 'loading':
            return <RefuelSkeleton />

        case 'subsequent_failed':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
