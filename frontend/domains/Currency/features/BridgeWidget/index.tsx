import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Pressable } from 'react-native'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Bridge } from '@zeal/uikit/Icon/Bridge'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import { fetchBridgeRequestStatus } from '@zeal/domains/Currency/domains/Bridge/api/fetchBridgeRequestStatus'
import { useCurrencyById } from '@zeal/domains/Currency/hooks/useCurrencyById'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

import { Progress } from './Progress'
import { Status } from './Status'

type Props = {
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_bridge_submitted_click'; bridgeSubmitted: BridgeSubmitted }
    | { type: 'bridge_completed'; bridgeSubmitted: BridgeSubmitted }

export const BridgeWidget = ({ bridgeSubmitted, onMsg }: Props) => {
    const {
        knownCurrencies,
        route: { from, to },
    } = bridgeSubmitted

    const toCurrency = useCurrencyById(to.currencyId, knownCurrencies)
    const fromCurrency = useCurrencyById(from.currencyId, knownCurrencies)

    const useLiveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchBridgeRequestStatus,
        { type: 'loading', params: { request: bridgeSubmitted } },
        {
            pollIntervalMilliseconds: 10_000,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                        return false
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        switch (pollable.data.targetTransaction.type) {
                            case 'pending':
                            case 'not_started':
                                return false
                            case 'completed':
                                if (!bridgeSubmitted.route.refuel) {
                                    return true
                                }

                                if (!pollable.data.refuel) {
                                    return false
                                }

                                switch (pollable.data.refuel.type) {
                                    case 'pending':
                                    case 'not_started':
                                        return false
                                    case 'completed':
                                        return true
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(
                                            pollable.data.refuel.type
                                        )
                                }

                            /* istanbul ignore next */
                            default:
                                return notReachable(
                                    pollable.data.targetTransaction.type
                                )
                        }
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    const nowTimestampMs = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
                return
            case 'error':
                captureError(pollable.error)
                return
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                switch (pollable.data.targetTransaction.type) {
                    case 'pending':
                    case 'not_started':
                        return
                    case 'completed':
                        if (!bridgeSubmitted.route.refuel) {
                            useLiveMsg.current({
                                type: 'bridge_completed',
                                bridgeSubmitted,
                            })
                            return
                        }
                        if (!pollable.data.refuel) {
                            return
                        }

                        switch (pollable.data.refuel.type) {
                            case 'pending':
                            case 'not_started':
                                return
                            case 'completed':
                                useLiveMsg.current({
                                    type: 'bridge_completed',
                                    bridgeSubmitted,
                                })
                                return
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data.refuel.type)
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(
                            pollable.data.targetTransaction.type
                        )
                }
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [pollable, bridgeSubmitted, useLiveMsg])

    if (!fromCurrency || !toCurrency) {
        return null
    }

    switch (pollable.type) {
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                // TODO ListItem2 is not capable of fitting progress bar at the bottom, check with @haywired on best approach to this
                <Pressable
                    role="button"
                    onPress={() =>
                        onMsg({
                            type: 'on_bridge_submitted_click',
                            bridgeSubmitted,
                        })
                    }
                >
                    <Group variant="default">
                        <Column spacing={12}>
                            <Row spacing={12}>
                                <Bridge size={32} color="iconDefault" />
                                <Column spacing={4} shrink>
                                    <Text
                                        variant="callout"
                                        weight="medium"
                                        color="textPrimary"
                                    >
                                        <FormattedMessage
                                            id="bridge_rote.widget.title"
                                            defaultMessage="Bridge"
                                        />
                                    </Text>

                                    <Row spacing={8}>
                                        <Text
                                            variant="footnote"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="bridge.widget.currencies"
                                                defaultMessage="{from} to {to}"
                                                values={{
                                                    from: fromCurrency.symbol,
                                                    to: toCurrency.symbol,
                                                }}
                                            />
                                        </Text>

                                        <Spacer />

                                        <Status
                                            bridgeSubmitted={bridgeSubmitted}
                                            bridgeSubmittedStatus={
                                                pollable.data
                                            }
                                            nowTimestampMs={nowTimestampMs}
                                        />
                                    </Row>
                                </Column>
                            </Row>

                            <Progress
                                bridgeSubmitted={bridgeSubmitted}
                                bridgeSubmittedStatus={pollable.data}
                                nowTimestampMs={nowTimestampMs}
                            />
                        </Column>
                    </Group>
                </Pressable>
            )

        case 'loading':
        case 'error':
            return (
                <Group variant="default">
                    <Column spacing={12}>
                        <Row spacing={12}>
                            <Bridge size={32} color="iconDefault" />
                            <Column spacing={4} shrink>
                                <Text
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    <FormattedMessage
                                        id="bridge_rote.widget.title"
                                        defaultMessage="Bridge"
                                    />
                                </Text>

                                <Row spacing={8}>
                                    <Text
                                        variant="footnote"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="bridge.widget.currencies"
                                            defaultMessage="{from} to {to}"
                                            values={{
                                                from: fromCurrency.symbol,
                                                to: toCurrency.symbol,
                                            }}
                                        />
                                    </Text>

                                    <Spacer />

                                    <Skeleton
                                        variant="default"
                                        width={55}
                                        height={15}
                                    />
                                </Row>
                            </Column>
                        </Row>

                        <Skeleton variant="default" width="100%" height={8} />
                    </Column>
                </Group>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
