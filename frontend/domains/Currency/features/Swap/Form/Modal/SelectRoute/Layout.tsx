import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Avatar } from '@zeal/uikit/Avatar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDiscount } from '@zeal/uikit/Icon/BoldDiscount'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { Swap } from '@zeal/uikit/Icon/Swap'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { SvgImage } from '@zeal/uikit/SvgImage'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'

import { ActionBarAccountIndicator } from '@zeal/domains/Account/components/ActionBarAccountIndicator'
import {
    SwapQuote,
    SwapQuoteRequest,
    SwapRoute,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedTokenBalanceWithSymbol } from '@zeal/domains/Money/components/FormattedTokenBalanceWithSymbol'

type Props = {
    pollable: LoadedReloadableData<SwapQuote, SwapQuoteRequest>
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_route_selected'; route: SwapRoute }
    | { type: 'on_slippage_clicked' }
    | { type: 'on_best_return_icon_clicked' }

export const Layout = ({ pollable, keystoreMap, onMsg }: Props) => {
    const { formatNumber, formatMessage } = useIntl()

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="swap-provider-modal"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
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
                                <Text id="swap-provider-modal">
                                    <FormattedMessage
                                        id="currency.swap.provider.header"
                                        defaultMessage="Swap provider"
                                    />
                                </Text>
                            </ActionBar.Header>
                        </Row>
                    </Clickable>
                }
                right={
                    <Tertiary
                        color="on_light"
                        size="small"
                        onClick={() => onMsg({ type: 'on_slippage_clicked' })}
                    >
                        {({ color, textVariant, textWeight }) => (
                            <Row spacing={4}>
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    <FormattedMessage
                                        id="SelectRoute.slippage"
                                        defaultMessage="Slippage {slippage}"
                                        values={{
                                            slippage: formatNumber(
                                                pollable.params
                                                    .swapSlippagePercent / 100,
                                                {
                                                    style: 'percent',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2,
                                                }
                                            ),
                                        }}
                                    />
                                </Text>
                                <LightArrowDown2 size={16} color={color} />
                            </Row>
                        )}
                    </Tertiary>
                }
            />

            <Column spacing={16}>
                {(() => {
                    switch (pollable.type) {
                        case 'reloading':
                            return new Array(2).fill(true).map((_, index) => (
                                <Group variant="default" key={index}>
                                    <ListItem
                                        aria-current={false}
                                        primaryText={
                                            <Skeleton
                                                variant="default"
                                                width={75}
                                                height={14}
                                            />
                                        }
                                        avatar={({ size }) => (
                                            <Skeleton
                                                variant="default"
                                                height={size}
                                                width={size}
                                            />
                                        )}
                                        size="regular"
                                        side={{
                                            title: (
                                                <Skeleton
                                                    variant="default"
                                                    width={75}
                                                    height={14}
                                                />
                                            ),
                                            subtitle: (
                                                <Skeleton
                                                    variant="default"
                                                    width={35}
                                                    height={14}
                                                />
                                            ),
                                        }}
                                    />
                                </Group>
                            ))

                        case 'loaded':
                        case 'subsequent_failed': {
                            const { routes, bestReturnRoute, knownCurrencies } =
                                pollable.data

                            return routes.length ? (
                                routes.map((route) => (
                                    <Group
                                        variant="default"
                                        key={route.dexName}
                                    >
                                        <ListItem
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_route_selected',
                                                    route,
                                                })
                                            }
                                            aria-current={false}
                                            primaryText={
                                                route.protocolDisplayName
                                            }
                                            avatar={({ size }) => (
                                                <Avatar
                                                    variant="squared"
                                                    size={size}
                                                >
                                                    <SvgImage
                                                        size={size}
                                                        src={route.protocolIcon}
                                                    />
                                                </Avatar>
                                            )}
                                            size="regular"
                                            side={{
                                                title: (
                                                    <Row spacing={4}>
                                                        {route.dexName ===
                                                            bestReturnRoute?.dexName && (
                                                            <Tertiary
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'currency.swap.best_return',
                                                                        defaultMessage:
                                                                            'Best return route',
                                                                    }
                                                                )}
                                                                color="on_light"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    onMsg({
                                                                        type: 'on_best_return_icon_clicked',
                                                                    })
                                                                    event.stopPropagation()
                                                                }}
                                                                size="regular"
                                                            >
                                                                {({
                                                                    color,
                                                                }) => (
                                                                    <BoldDiscount
                                                                        color="iconStatusSuccess"
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                )}
                                                            </Tertiary>
                                                        )}

                                                        <Text
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textPrimary"
                                                        >
                                                            <FormattedTokenBalanceWithSymbol
                                                                knownCurrencies={
                                                                    knownCurrencies
                                                                }
                                                                money={{
                                                                    amount: route.toAmount,
                                                                    currencyId:
                                                                        route.toCurrencyId,
                                                                }}
                                                            />
                                                        </Text>
                                                    </Row>
                                                ),
                                                subtitle:
                                                    route.estimatedGasFeeInDefaultCurrency && (
                                                        <Text
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textSecondary"
                                                        >
                                                            <FormattedMessage
                                                                id="route.fees"
                                                                defaultMessage="Network fees {fees}"
                                                                values={{
                                                                    fees: (
                                                                        <FormattedFeeInDefaultCurrency
                                                                            knownCurrencies={
                                                                                knownCurrencies
                                                                            }
                                                                            money={
                                                                                route.estimatedGasFeeInDefaultCurrency
                                                                            }
                                                                        />
                                                                    ),
                                                                }}
                                                            />
                                                        </Text>
                                                    ),
                                            }}
                                        />
                                    </Group>
                                ))
                            ) : (
                                <EmptyStateWidget
                                    icon={({ size }) => (
                                        <Swap size={size} color="iconDefault" />
                                    )}
                                    size="regular"
                                    title={
                                        <FormattedMessage
                                            id="SelectRoutes.emptyState"
                                            defaultMessage="We found no routes for this swap"
                                        />
                                    }
                                />
                            )
                        }

                        /* istanbul ignore next */
                        default:
                            return notReachable(pollable)
                    }
                })()}
            </Column>
        </Screen>
    )
}
