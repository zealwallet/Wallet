import { notReachable } from '@zeal/toolkit'

import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'

export const shouldWeConfirmSafetyCheck = (
    checks: ConnectionSafetyCheck[]
): boolean => {
    return !!checks.find((check) => {
        switch (check.state) {
            case 'Passed':
                return false
            case 'Failed':
                switch (check.severity) {
                    case 'Caution':
                        return false
                    case 'Danger':
                        return true
                    /* istanbul ignore next */
                    default:
                        return notReachable(check.severity)
                }
            /* istanbul ignore next */
            default:
                return notReachable(check)
        }
    })
}
