import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { add } from 'date-fns'

import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { Currency } from '@zeal/domains/Currency'
import { PermitExpiration } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'

type Props = {
    nowTimestampMs: number
    permitExpiration: PermitExpiration
    currency: Currency
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_editing_locked_click' }
    | { type: 'on_expiration_time_warning_click' }

const TOO_LONG_EXPIRATION_THRESHOLD_HOURS = 720

export const ExpirationTime = ({
    permitExpiration,
    nowTimestampMs,
    currency,
    onMsg,
}: Props) => {
    const formatHumanReadableDuration = useReadableDuration()
    const { formatMessage } = useIntl()

    switch (permitExpiration.type) {
        case 'FiniteExpiration':
            return add(nowTimestampMs, {
                hours: TOO_LONG_EXPIRATION_THRESHOLD_HOURS,
            }).valueOf() > permitExpiration.timestamp ? (
                <Tertiary
                    aria-label={formatMessage(
                        {
                            id: 'permit.edit-expiration',
                            defaultMessage: 'Edit {currency} expiration',
                        },
                        { currency: currency.symbol }
                    )}
                    color="on_light"
                    size="regular"
                    onClick={() => onMsg({ type: 'on_editing_locked_click' })}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                {formatHumanReadableDuration(
                                    permitExpiration.timestamp - nowTimestampMs,
                                    'ceil',
                                    'long'
                                )}
                            </Text>
                            <BoldLock size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            ) : (
                <Row spacing={8}>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage(
                            {
                                id: 'permit.expiration-warning',
                                defaultMessage: '{currency} expiration warning',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_expiration_time_warning_click' })
                        }
                    >
                        {({ color }) => (
                            <BoldDangerTriangle
                                size={14}
                                color="iconStatusWarning"
                            />
                        )}
                    </IconButton>
                    <Tertiary
                        aria-label={formatMessage(
                            {
                                id: 'permit.edit-expiration',
                                defaultMessage: 'Edit {currency} expiration',
                            },
                            { currency: currency.symbol }
                        )}
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_editing_locked_click' })
                        }
                    >
                        {({ color, textVariant, textWeight }) => (
                            <>
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    {formatHumanReadableDuration(
                                        permitExpiration.timestamp -
                                            nowTimestampMs,
                                        'ceil',
                                        'long'
                                    )}
                                </Text>
                                <BoldLock size={14} color={color} />
                            </>
                        )}
                    </Tertiary>
                </Row>
            )
        case 'InfiniteExpiration':
            return (
                <Row spacing={8}>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage(
                            {
                                id: 'permit.expiration-warning',
                                defaultMessage: '{currency} expiration warning',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_expiration_time_warning_click' })
                        }
                    >
                        {() => (
                            <BoldDangerTriangle
                                size={14}
                                color="iconStatusWarning"
                            />
                        )}
                    </IconButton>
                    <Tertiary
                        aria-label={formatMessage(
                            {
                                id: 'permit.edit-expiration',
                                defaultMessage: 'Edit {currency} expiration',
                            },
                            { currency: currency.symbol }
                        )}
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_editing_locked_click' })
                        }
                    >
                        {({ color, textVariant, textWeight }) => (
                            <>
                                <Text
                                    color={color}
                                    variant={textVariant}
                                    weight={textWeight}
                                >
                                    <FormattedMessage
                                        id="permit.expiration.never"
                                        defaultMessage="Never"
                                    />
                                </Text>
                                <BoldLock size={14} color={color} />
                            </>
                        )}
                    </Tertiary>
                </Row>
            )
        default:
            return notReachable(permitExpiration)
    }
}
