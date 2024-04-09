import { BoldShieldCaution } from '@zeal/uikit/Icon/BoldShieldCaution'
import { ShieldDone } from '@zeal/uikit/Icon/ShieldDone'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'

import { notReachable } from '@zeal/toolkit'

import {
    ConnectionSafetyCheckResult,
    SignMessageSafetyCheckResult,
    TransactionSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheckResult:
        | ConnectionSafetyCheckResult
        | TransactionSafetyCheckResult
        | SignMessageSafetyCheckResult
    size: number
}

/**
 * TODO not the best design, probably better to use custom components inplace instead of this "generic one"
 */
export const ResultIcon = ({ safetyCheckResult, size }: Props) => {
    switch (safetyCheckResult.type) {
        case 'Failure':
            const safetyCheck = safetyCheckResult.reason.failedChecks[0]
            switch (safetyCheck.severity) {
                case 'Caution':
                    return (
                        <BoldShieldCaution size={size} color="statusWarning" />
                    )

                case 'Danger':
                    return <ShieldFail size={size} color="statusCritical" />

                default:
                    return notReachable(safetyCheck.severity)
            }
        case 'Success':
            return <ShieldDone size={size} color="statusSuccess" />

        default:
            return notReachable(safetyCheckResult)
    }
}
