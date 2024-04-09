import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    TransactionSafetyCheck,
    TransactionSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'

import { ResultIcon } from './ResultIcon'
import { TransactionSafetyCheckSubtitle } from './TransactionSafetyCheckSubtitle'
import { TransactionSafetyCheckTitle } from './TransactionSafetyCheckTitle'

type Props = {
    safetyCheckResult: TransactionSafetyCheckResult
    knownCurrencies: KnownCurrencies
    onClick: () => void
}

const getVariant = (safetyCheck: TransactionSafetyCheck) => {
    switch (safetyCheck.severity) {
        case 'Caution':
            return 'warning'

        case 'Danger':
            return 'critical'

        default:
            return notReachable(safetyCheck.severity)
    }
}

export const TransactionStatusButton = ({
    knownCurrencies,
    onClick,
    safetyCheckResult,
}: Props) => {
    const rightIcon = (
        <Row spacing={4}>
            <ResultIcon size={20} safetyCheckResult={safetyCheckResult} />
            <ArrowDown size={24} color="iconDefault" />
        </Row>
    )

    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]

            return (
                <Progress
                    onClick={onClick}
                    variant={getVariant(safetyCheck)}
                    progress={100}
                    initialProgress={100}
                    title={
                        <TransactionSafetyCheckTitle
                            knownCurrencies={knownCurrencies}
                            safetyCheck={safetyCheck}
                        />
                    }
                    subtitle={
                        <TransactionSafetyCheckSubtitle
                            knownCurrencies={knownCurrencies}
                            safetyCheck={safetyCheck}
                        />
                    }
                    right={rightIcon}
                />
            )
        }

        case 'Success':
            return (
                <Progress
                    onClick={onClick}
                    variant="success"
                    progress={100}
                    initialProgress={100}
                    title={
                        <FormattedMessage
                            id="TransactionSafetyCheckResult.passed"
                            defaultMessage="Safety Checks Passed"
                        />
                    }
                    right={rightIcon}
                />
            )

        default:
            return notReachable(safetyCheckResult)
    }
}
