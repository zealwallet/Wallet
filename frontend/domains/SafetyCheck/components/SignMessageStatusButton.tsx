import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    SignMessageSafetyCheck,
    SignMessageSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'

import { ResultIcon } from './ResultIcon'
import { SignMessageSafetyCheckSubtitle } from './SignMessageSafetyCheckSubtitle'
import { SignMessageSafetyCheckTitle } from './SignMessageSafetyCheckTitle'

type Props = {
    safetyCheckResult: SignMessageSafetyCheckResult
    knownCurrencies: KnownCurrencies
    onClick: () => void
}

const getVariant = (safetyCheck: SignMessageSafetyCheck) => {
    switch (safetyCheck.severity) {
        case 'Caution':
            return 'warning'

        case 'Danger':
            return 'critical'

        default:
            return notReachable(safetyCheck.severity)
    }
}

export const SignMessageStatusButton = ({
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
                        <SignMessageSafetyCheckTitle
                            knownCurrencies={knownCurrencies}
                            safetyCheck={safetyCheck}
                        />
                    }
                    subtitle={
                        <SignMessageSafetyCheckSubtitle
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
                            id="SignMessageSafetyCheckResult.passed"
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
