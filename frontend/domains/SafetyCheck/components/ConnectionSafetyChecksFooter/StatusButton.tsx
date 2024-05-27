import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

import { ConnectionSafetyCheckResult } from '@zeal/domains/SafetyCheck'

import { ResultIcon } from '../ResultIcon'

type Props = {
    safetyCheckResult: ConnectionSafetyCheckResult
    onClick: () => void
}

const Label = ({
    safetyCheckResult,
}: {
    safetyCheckResult: ConnectionSafetyCheckResult
}) => {
    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.type) {
                case 'SuspiciousCharactersCheck':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.failed.statusButton.label"
                            defaultMessage="Address has unusual characters "
                        />
                    )

                case 'BlacklistCheck':
                    return (
                        <FormattedMessage
                            id="SuspiciousCharactersCheck.failed.statusButton.label"
                            defaultMessage="Site has been reported"
                        />
                    )

                case 'DAppVerificationCheck':
                    return (
                        <FormattedMessage
                            id="DAppVerificationCheck.failed.statusButton.label"
                            defaultMessage="Site wasn’t found in app registries"
                        />
                    )

                default:
                    return notReachable(safetyCheck)
            }
        }

        case 'Success':
            return (
                <FormattedMessage
                    id="ConnectionSafetyCheckResult.passed"
                    defaultMessage="Safety Check passed"
                />
            )

        default:
            return notReachable(safetyCheckResult)
    }
}

const getVariant = (safetyCheckResult: ConnectionSafetyCheckResult) => {
    switch (safetyCheckResult.type) {
        case 'Failure': {
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.severity) {
                case 'Caution':
                    return 'warning'

                case 'Danger':
                    return 'critical'

                default:
                    return notReachable(safetyCheck.severity)
            }
        }
        case 'Success':
            return 'success'

        default:
            return notReachable(safetyCheckResult)
    }
}

export const StatusButton = ({ safetyCheckResult, onClick }: Props) => (
    <Progress
        progress={100}
        initialProgress={100}
        variant={getVariant(safetyCheckResult)}
        title={<Label safetyCheckResult={safetyCheckResult} />}
        right={
            <Row spacing={4}>
                <ResultIcon size={20} safetyCheckResult={safetyCheckResult} />
                <ArrowDown size={20} color="iconDefault" />
            </Row>
        }
        onClick={onClick}
    />
)
