import { FormattedMessage, useIntl } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { Refresh } from '@zeal/uikit/Icon/Refresh'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { SvgImage } from '@zeal/uikit/SvgImage'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { BridgePollable } from '@zeal/domains/Currency/domains/Bridge'
import { FormattedFeeInDefaultCurrency } from '@zeal/domains/Money/components/FormattedFeeInDefaultCurrency'

import { getBridgeRouteRequest } from './validation'

type Props = {
    pollable: BridgePollable
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_route_click' }
    | { type: 'on_try_again_clicked' }
    | { type: 'on_slippage_clicked' }

export const Route = ({ pollable, onMsg }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (pollable.type) {
        case 'loading':
        case 'reloading':
            return (
                <Column spacing={12}>
                    <Header
                        swapSlippagePercent={pollable.params.slippagePercent}
                        onMsg={onMsg}
                    />

                    <FeeInputButton
                        left={
                            <Skeleton
                                variant="default"
                                width={35}
                                height={16}
                            />
                        }
                        right={
                            <Skeleton
                                variant="default"
                                width={55}
                                height={16}
                            />
                        }
                        onClick={() => onMsg({ type: 'on_route_click' })}
                    />
                </Column>
            )

        case 'error':
        case 'subsequent_failed':
            return (
                <Column spacing={12}>
                    <Header
                        swapSlippagePercent={pollable.params.slippagePercent}
                        onMsg={onMsg}
                    />

                    <Progress
                        rounded
                        variant="critical"
                        progress={100}
                        initialProgress={100}
                        title={
                            <FormattedMessage
                                id="currency.bridge.bridge_provider_loading_failed"
                                defaultMessage="We had issues loading providers"
                            />
                        }
                        subtitle={null}
                        right={
                            <Tertiary
                                size="regular"
                                color="critical"
                                onClick={() =>
                                    onMsg({ type: 'on_try_again_clicked' })
                                }
                            >
                                {({ color, textVariant, textWeight }) => (
                                    <>
                                        <Refresh size={14} color={color} />
                                        <Text
                                            color={color}
                                            variant={textVariant}
                                            weight={textWeight}
                                        >
                                            <FormattedMessage
                                                id="action.retry"
                                                defaultMessage="Retry"
                                            />
                                        </Text>
                                    </>
                                )}
                            </Tertiary>
                        }
                    />
                </Column>
            )

        case 'loaded': {
            const bridgeRouteRequest = getBridgeRouteRequest({ pollable })

            return (
                bridgeRouteRequest && (
                    <Column spacing={12}>
                        <Header
                            swapSlippagePercent={
                                pollable.params.slippagePercent
                            }
                            onMsg={onMsg}
                        />

                        <FeeInputButton
                            left={
                                <Row spacing={4}>
                                    <Avatar variant="squared" size={20}>
                                        <SvgImage
                                            size={20}
                                            src={bridgeRouteRequest.route.icon}
                                        />
                                    </Avatar>

                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textPrimary"
                                    >
                                        {bridgeRouteRequest.route.displayName}
                                    </Text>
                                </Row>
                            }
                            right={
                                <Row spacing={4}>
                                    <Row spacing={12}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textPrimary"
                                        >
                                            {formatHumanReadableDuration(
                                                bridgeRouteRequest.route
                                                    .serviceTimeMs
                                            )}
                                        </Text>

                                        {bridgeRouteRequest.route
                                            .feeInDefaultCurrency && (
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textPrimary"
                                            >
                                                <FormattedMessage
                                                    id="route.fees"
                                                    defaultMessage="Network fees {fees}"
                                                    values={{
                                                        fees: (
                                                            <FormattedFeeInDefaultCurrency
                                                                knownCurrencies={
                                                                    bridgeRouteRequest.knownCurrencies
                                                                }
                                                                money={
                                                                    bridgeRouteRequest
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
                                    <LightArrowDown2
                                        size={20}
                                        color="iconDefault"
                                    />
                                </Row>
                            }
                            onClick={() => onMsg({ type: 'on_route_click' })}
                        />
                    </Column>
                )
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const Header = ({
    swapSlippagePercent,
    onMsg,
}: {
    swapSlippagePercent: number
    onMsg: (msg: { type: 'on_slippage_clicked' }) => void
}) => {
    const { formatNumber } = useIntl()
    return (
        <Row spacing={4} alignX="stretch">
            <Text variant="footnote" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="currency.bridge.bridge_provider"
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
                                id="SelectRoute.slippage"
                                defaultMessage="Slippage {slippage}"
                                values={{
                                    slippage: formatNumber(
                                        swapSlippagePercent / 100,
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
    )
}
