import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Currency } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import {
    PermitAllowance,
    SimulatedSignMessage,
} from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'
import { ExpirationTime } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation/components/ExpirationTime'
import { SignMessageSafetyCheck } from '@zeal/domains/SafetyCheck'
import { CurrencyBadge } from '@zeal/domains/SafetyCheck/components/CurrencyBadge'
import { ApprovalAmount } from '@zeal/domains/Transactions'

import { Message } from '../../../../Message'

type Props = {
    request: SignMessageRequest
    simulatedSignMessage: SimulatedSignMessage
    safetyChecks: SignMessageSafetyCheck[]
    nowTimestampMs: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_spend_limit_info_icon_clicked' }
    | { type: 'on_expiration_info_icon_clicked' }
    | { type: 'on_spend_limit_warning_click' }
    | MsgOf<typeof ExpirationTime>

export const Content = ({
    simulatedSignMessage,
    safetyChecks,
    request,
    nowTimestampMs,
    onMsg,
}: Props) => {
    switch (simulatedSignMessage.type) {
        case 'Permit2SignMessage':
            return (
                <Column spacing={8}>
                    {simulatedSignMessage.allowances.map(
                        (permitAllowance, index) => (
                            <React.Fragment
                                key={`${permitAllowance.amount.amount.currency.id}${index}`}
                            >
                                <PermitAllowanceItem
                                    permitAllowance={permitAllowance}
                                    safetyChecks={safetyChecks}
                                    nowTimestampMs={nowTimestampMs}
                                    onMsg={onMsg}
                                />

                                {index !==
                                    simulatedSignMessage.allowances.length -
                                        1 && <Divider variant="secondary" />}
                            </React.Fragment>
                        )
                    )}
                </Column>
            )

        case 'PermitSignMessage':
        case 'DaiPermitSignMessage':
            return (
                <PermitAllowanceItem
                    permitAllowance={simulatedSignMessage.allowance}
                    safetyChecks={safetyChecks}
                    nowTimestampMs={nowTimestampMs}
                    onMsg={onMsg}
                />
            )

        case 'UnknownSignMessage':
            return <Message request={request} />

        default:
            return notReachable(simulatedSignMessage)
    }
}

const PermitAllowanceItem = ({
    permitAllowance,
    safetyChecks,
    nowTimestampMs,
    onMsg,
}: {
    permitAllowance: PermitAllowance
    safetyChecks: SignMessageSafetyCheck[]
    nowTimestampMs: number
    onMsg: (msg: Msg) => void
}) => {
    const { formatMessage } = useIntl()

    const currency = permitAllowance.amount.amount.currency
    return (
        <Column spacing={8}>
            <ListItem
                avatar={({ size }) => (
                    <Avatar
                        size={size}
                        currency={currency}
                        rightBadge={({ size }) => (
                            <CurrencyBadge
                                size={size}
                                currencyId={currency.id}
                                safetyChecks={safetyChecks}
                            />
                        )}
                    />
                )}
                aria-current={false}
                size="large"
                primaryText={currency.symbol}
            />

            <Row spacing={4}>
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="sign.PermitAllowanceItem.spendLimit"
                            defaultMessage="Spend limit"
                        />
                    </Text>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage(
                            {
                                id: 'permit.spend-limit.info',
                                defaultMessage: '{currency} spend limit info',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({
                                type: 'on_spend_limit_info_icon_clicked',
                            })
                        }
                    >
                        {({ color }) => <InfoCircle size={14} color={color} />}
                    </IconButton>
                </Row>
                <Spacer />
                <FormattedApprovalAmount
                    currency={currency}
                    onMsg={onMsg}
                    approvalAmount={permitAllowance.amount}
                />
            </Row>

            <Row spacing={4}>
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="permit.edit-modal.expiresIn"
                            defaultMessage="Expires in…"
                        />
                    </Text>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage(
                            {
                                id: 'permit.expiration.info',
                                defaultMessage: '{currency} expiration info',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({
                                type: 'on_expiration_info_icon_clicked',
                            })
                        }
                    >
                        {({ color }) => <InfoCircle size={14} color={color} />}
                    </IconButton>
                </Row>
                <Spacer />
                <ExpirationTime
                    currency={currency}
                    nowTimestampMs={nowTimestampMs}
                    permitExpiration={permitAllowance.expiration}
                    onMsg={onMsg}
                />
            </Row>
        </Column>
    )
}

const FormattedApprovalAmount = ({
    approvalAmount,
    onMsg,
    currency,
}: {
    currency: Currency
    approvalAmount: ApprovalAmount
    onMsg: (msg: Msg) => void
}) => {
    const { formatMessage } = useIntl()

    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Tertiary
                    aria-label={formatMessage(
                        {
                            id: 'permit.edit-limit',
                            defaultMessage: 'Edit {currency} spend limit',
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
                                ellipsis
                            >
                                <FormattedTokenBalances2
                                    money={approvalAmount.amount}
                                />
                            </Text>
                            <BoldLock size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            )

        case 'Unlimited':
            return (
                <Row spacing={8}>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage(
                            {
                                id: 'permit.spend-limit.warning',
                                defaultMessage:
                                    '{currency} spend limit warning',
                            },
                            { currency: currency.symbol }
                        )}
                        onClick={() =>
                            onMsg({ type: 'on_spend_limit_warning_click' })
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
                                id: 'permit.edit-limit',
                                defaultMessage: 'Edit {currency} spend limit',
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
                                        id="simulation.approve.unlimited"
                                        defaultMessage="Unlimited"
                                    />
                                </Text>
                                <BoldLock size={14} color={color} />
                            </>
                        )}
                    </Tertiary>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
