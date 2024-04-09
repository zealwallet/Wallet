import { failure, success } from '@zeal/toolkit/Result'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SafetyCheck } from '@zeal/domains/SafetyCheck'

import { ConnectionSafetyCheckResult } from '../SafetyCheckResult'

const isFailedCheck = <T extends SafetyCheck>(
    check: T
): check is Extract<T, { state: 'Failed' }> => {
    return check.state === 'Failed'
}

export const calculateConnectionSafetyChecksResult = (
    checks: ConnectionSafetyCheck[]
): ConnectionSafetyCheckResult => {
    const failedChecks = checks.filter(isFailedCheck)

    return failedChecks.length
        ? failure({ type: 'safety_check_failed', failedChecks })
        : success(undefined)
}
