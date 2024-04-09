import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldEdit } from '@zeal/uikit/Icon/BoldEdit'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { FormattedTokenBalances2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { CurrencyBadge } from '@zeal/domains/SafetyCheck/components/CurrencyBadge'
import { ApprovalAmount } from '@zeal/domains/Transactions'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    transaction: ApprovalTransaction
    checks: TransactionSafetyCheck[]
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_spend_limit_info_click' }
    | { type: 'on_edit_spend_limit_click' }
    | { type: 'on_spend_limit_warning_click' }

export const Layout = ({
    transaction,
    knownCurrencies,
    checks,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

    const { amount } = transaction.amount
    const currency = amount.currency

    return (
        <Column spacing={8}>
            {currency && (
                <ListItem
                    avatar={({ size }) => (
                        <Avatar
                            size={size}
                            currency={currency}
                            rightBadge={({ size }) => (
                                <CurrencyBadge
                                    size={size}
                                    currencyId={currency.id}
                                    safetyChecks={checks}
                                />
                            )}
                        />
                    )}
                    aria-current={false}
                    size="large"
                    primaryText={currency.symbol}
                />
            )}

            <Row spacing={0}>
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="simulation.approval.spend-limit.label"
                            defaultMessage="Spend limit"
                        />
                    </Text>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'approval.spend_limit_info',
                            defaultMessage: 'What is spend limit?',
                        })}
                        onClick={() =>
                            onMsg({ type: 'on_spend_limit_info_click' })
                        }
                    >
                        {({ color }) => <InfoCircle size={14} color={color} />}
                    </IconButton>
                </Row>

                <Spacer />

                <FormattedApprovalAmount
                    onMsg={onMsg}
                    approvalAmount={transaction.amount}
                    knownCurrencies={knownCurrencies}
                />
            </Row>
        </Column>
    )
}

const FormattedApprovalAmount = ({
    approvalAmount,
    knownCurrencies,
    onMsg,
}: {
    approvalAmount: ApprovalAmount
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}) => {
    const { formatMessage } = useIntl()
    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Tertiary
                    aria-label={formatMessage({
                        id: 'approval.edit-limit.label',
                        defaultMessage: 'Edit spend limit',
                    })}
                    color="on_light"
                    size="regular"
                    onClick={() => onMsg({ type: 'on_edit_spend_limit_click' })}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedTokenBalances2
                                    money={approvalAmount.amount}
                                />
                            </Text>
                            <BoldEdit size={14} color={color} />
                        </>
                    )}
                </Tertiary>
            )

        case 'Unlimited':
            return (
                <Row spacing={8}>
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({ type: 'on_spend_limit_warning_click' })
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
                        aria-label="Edit spend limit"
                        color="on_light"
                        size="regular"
                        onClick={() =>
                            onMsg({ type: 'on_edit_spend_limit_click' })
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
                                <BoldEdit size={14} color={color} />
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
