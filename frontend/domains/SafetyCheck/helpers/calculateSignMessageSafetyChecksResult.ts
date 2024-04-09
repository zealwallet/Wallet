import { failure, success } from '@zeal/toolkit/Result'

import {
    SafetyCheck,
    SignMessageSafetyCheck,
    SignMessageSafetyCheckResult,
} from '@zeal/domains/SafetyCheck'

const isFailedCheck = <T extends SafetyCheck>(
    check: T
): check is Extract<T, { state: 'Failed' }> => check.state === 'Failed'

export const calculateSignMessageSafetyChecksResult = (
    checks: SignMessageSafetyCheck[]
): SignMessageSafetyCheckResult => {
    const failedChecks = checks.filter(isFailedCheck)

    return failedChecks.length
        ? failure({ type: 'safety_check_failed', failedChecks })
        : success(undefined)
}
