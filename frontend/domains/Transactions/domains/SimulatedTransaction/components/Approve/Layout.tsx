import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
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
    | { type: 'on_spend_limit_warning_click' }

export const Layout = ({
    transaction,
    knownCurrencies,
    checks,
    onMsg,
}: Props) => {
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
    switch (approvalAmount.type) {
        case 'Limited':
            return (
                <Text
                    variant="paragraph"
                    weight="regular"
                    color="textSecondary"
                >
                    <FormattedTokenBalances2 money={approvalAmount.amount} />
                </Text>
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
                        {() => (
                            <BoldDangerTriangle
                                size={14}
                                color="iconStatusWarning"
                            />
                        )}
                    </IconButton>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="simulation.approve.unlimited"
                            defaultMessage="Unlimited"
                        />
                    </Text>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(approvalAmount)
    }
}
