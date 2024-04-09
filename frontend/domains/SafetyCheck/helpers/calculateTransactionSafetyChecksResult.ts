import { failure, success } from '@zeal/toolkit/Result'

import { SafetyCheck } from '@zeal/domains/SafetyCheck'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

import { TransactionSafetyCheckResult } from '../SafetyCheckResult'

const isFailedCheck = <T extends SafetyCheck>(
    check: T
): check is Extract<T, { state: 'Failed' }> => check.state === 'Failed'

export const calculateTransactionSafetyChecksResult = (
    checks: TransactionSafetyCheck[]
): TransactionSafetyCheckResult => {
    const failedChecks = checks.filter(isFailedCheck)

    return failedChecks.length
        ? failure({ type: 'safety_check_failed', failedChecks })
        : success(undefined)
}
