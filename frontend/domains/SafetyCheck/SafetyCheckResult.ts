import { Result } from '@zeal/toolkit/Result'

import {
    FailedConnectionSafetyCheck,
    FailedSignMessageSafetyCheck,
    FailedTransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'

export type ConnectionSafetyCheckResult = Result<
    {
        type: 'safety_check_failed'
        failedChecks: FailedConnectionSafetyCheck[]
    },
    unknown
>

export type TransactionSafetyCheckResult = Result<
    {
        type: 'safety_check_failed'
        failedChecks: FailedTransactionSafetyCheck[]
    },
    unknown
>

export type SignMessageSafetyCheckResult = Result<
    {
        type: 'safety_check_failed'
        failedChecks: FailedSignMessageSafetyCheck[]
    },
    unknown
>
