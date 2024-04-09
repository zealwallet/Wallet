import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Range } from '@zeal/toolkit/Range'

import { SuspiciousCharactersCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'

export const getHighlighting = (
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
): Range | null => {
    switch (safetyChecksLoadable.type) {
        case 'loaded': {
            const suspiciousCharactersCheck =
                safetyChecksLoadable.data.checks.find(
                    (check): check is SuspiciousCharactersCheck => {
                        switch (check.type) {
                            case 'SuspiciousCharactersCheck':
                                return true
                            case 'BlacklistCheck':
                            case 'DAppVerificationCheck':
                                return false

                            /* istanbul ignore next */
                            default:
                                return notReachable(check)
                        }
                    }
                )

            if (!suspiciousCharactersCheck) {
                return null
            }

            switch (suspiciousCharactersCheck.state) {
                case 'Failed':
                    return suspiciousCharactersCheck.suspiciousPart

                case 'Passed':
                    return null

                /* istanbul ignore next */
                default:
                    return notReachable(suspiciousCharactersCheck)
            }
        }

        case 'loading':
        case 'error':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}
