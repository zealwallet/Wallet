import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { ConnectionSafetyChecksResponse } from '../api/fetchConnectionSafetyChecks'
import {
    ConnectionSafetyCheck,
    FailedConnectionSafetyCheck,
} from '../ConnectionSafetyCheck'

type CheckError =
    | { type: 'safety_checks_are_not_loaded' }
    | { type: 'safety_checks_user_confirmation_not_required' }

export const calculateConnectionSafetyChecksUserConfirmation = ({
    safetyChecksLoadable,
}: {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
}): Result<CheckError, FailedConnectionSafetyCheck[]> => {
    switch (safetyChecksLoadable.type) {
        case 'loaded': {
            const checks = safetyChecksLoadable.data.checks
                .filter(
                    (
                        check
                    ): check is Extract<
                        ConnectionSafetyCheck,
                        { state: 'Failed' }
                    > => {
                        switch (check.state) {
                            case 'Failed':
                                return true

                            case 'Passed':
                                return false

                            default:
                                return notReachable(check)
                        }
                    }
                )
                .filter((check) => {
                    switch (check.severity) {
                        case 'Danger':
                            return true

                        case 'Caution':
                            return false

                        default:
                            return notReachable(check.severity)
                    }
                })

            return checks.length
                ? success(checks)
                : failure({
                      type: 'safety_checks_user_confirmation_not_required',
                  })
        }

        case 'loading':
        case 'error':
            return failure({ type: 'safety_checks_are_not_loaded' })

        default:
            return notReachable(safetyChecksLoadable)
    }
}
