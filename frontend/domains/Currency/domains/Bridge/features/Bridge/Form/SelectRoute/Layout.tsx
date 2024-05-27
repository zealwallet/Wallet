import { FormattedMessage, useIntl } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDiscount } from '@zeal/uikit/Icon/BoldDiscount'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { SolidLightning } from '@zeal/uikit/Icon/SolidLightning'
import { Swap } from '@zeal/uikit/Icon/Swap'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { SvgImage } from '@zeal/uikit/SvgImage'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    BridgePollable,
    BridgeRequest,
} from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'
import { FormattedTokenBalanceWithSymbol } from '@zeal/domains/Money/components/FormattedTokenBalanceWithSymbol'

type Props = {
    pollable: BridgePollable
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_route_selected'; route: BridgeRequest }
    | { type: 'on_slippage_clicked' }
    | { type: 'on_best_return_icon_clicked' }
    | { type: 'on_best_service_time_icon_clicked' }

export const Layout = ({ pollable, keystoreMap, onMsg }: Props) => {
    const { formatNumber, formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="bridge-provider-modal"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: pollable.params.fromAccount.address,
                })}
                account={pollable.params.fromAccount}
                network={null}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16}>
                <Row spacing={8} alignX="stretch">
                    <Text
                        variant="title3"
                        weight="bold"
                        color="textPrimary"
                        id="bridge-provider-modal"
                    >
                        <FormattedMessage
                            id="BridgeRoute.title"
                            defaultMessage="Bridge provider"
                        />
                    </Text>

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
                                        id="BridgeRoute.slippage"
                                        defaultMessage="Slippage {slippage}"
                                        values={{
                                            slippage: formatNumber(
                                                pollable.params
                                                    .slippagePercent / 100,
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
                </Row>

                {(() => {
                    switch (pollable.type) {
                        case 'loading':
                        case 'error':
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
                            const routes = pollable.data
                            const bestReturnRoute: BridgeRequest | null =
                                routes[0]

                            const bestServiceTimeRoute: BridgeRequest | null =
                                routes.reduce((fastest, current) => {
                                    if (!fastest) {
                                        return current
                                    }

                                    return current.route.serviceTimeMs <
                                        fastest.route.serviceTimeMs
                                        ? current
                                        : fastest
                                }, null as BridgeRequest | null)

                            return routes.length ? (
                                routes.map((route) => (
                                    <Group
                                        variant="default"
                                        key={route.route.name}
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
                                                route.route.displayName
                                            }
                                            avatar={({ size }) => (
                                                <Avatar
                                                    variant="squared"
                                                    size={size}
                                                >
                                                    <SvgImage
                                                        size={size}
                                                        src={route.route.icon}
                                                    />
                                                </Avatar>
                                            )}
                                            size="regular"
                                            side={{
                                                title: (
                                                    <Row spacing={4} shrink>
                                                        {route.route.name ===
                                                            bestReturnRoute
                                                                ?.route
                                                                .name && (
                                                            <Tertiary
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
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'bridge.best_return',
                                                                        defaultMessage:
                                                                            'Best return route',
                                                                    }
                                                                )}
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

                                                        {route.route.name ===
                                                            bestServiceTimeRoute
                                                                ?.route
                                                                .name && (
                                                            <Tertiary
                                                                color="on_light"
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    onMsg({
                                                                        type: 'on_best_service_time_icon_clicked',
                                                                    })
                                                                    event.stopPropagation()
                                                                }}
                                                                size="regular"
                                                                aria-label={formatMessage(
                                                                    {
                                                                        id: 'bridge.best_serivce_time',
                                                                        defaultMessage:
                                                                            'Best service time route',
                                                                    }
                                                                )}
                                                            >
                                                                {({
                                                                    color,
                                                                }) => (
                                                                    <SolidLightning
                                                                        color="iconStatusNeutral"
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
                                                                    route.knownCurrencies
                                                                }
                                                                money={
                                                                    route.route
                                                                        .to
                                                                }
                                                            />
                                                        </Text>
                                                    </Row>
                                                ),
                                                subtitle: (
                                                    <Row spacing={12} shrink>
                                                        <Text
                                                            variant="paragraph"
                                                            weight="regular"
                                                            color="textSecondary"
                                                        >
                                                            {formatHumanReadableDuration(
                                                                route.route
                                                                    .serviceTimeMs
                                                            )}
                                                        </Text>

                                                        {route.route
                                                            .feeInDefaultCurrency && (
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
                                                                                    route.knownCurrencies
                                                                                }
                                                                                money={
                                                                                    route
                                                                                        .route
                                                                                        .feeInDefaultCurrency
                                                                                }
                                                                            />
                                                                        ),
                                                                    }}
                                                                />
                                                            </Text>
                                                        )}
                                                    </Row>
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
                                            id="currencies.bridge.select_routes.emptyState"
                                            defaultMessage="We found no routes for this bridge"
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
