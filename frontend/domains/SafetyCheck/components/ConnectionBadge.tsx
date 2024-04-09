import { BadgeSize } from '@zeal/uikit/Avatar'
import { BoldShieldCautionWithBorder } from '@zeal/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from '@zeal/uikit/Icon/BoldShieldDoneWithBorder'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksResult } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksResult'

export const ConnectionBadge = ({
    safetyChecksLoadable,
    size,
}: {
    size: BadgeSize
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
}) => {
    switch (safetyChecksLoadable.type) {
        case 'loaded': {
            const safetyCheckResult = calculateConnectionSafetyChecksResult(
                safetyChecksLoadable.data.checks
            )

            switch (safetyCheckResult.type) {
                case 'Failure':
                    return (
                        <BoldShieldCautionWithBorder
                            size={size}
                            color="statusWarning"
                        />
                    )
                case 'Success':
                    return (
                        <BoldShieldDoneWithBorder
                            size={size}
                            color="statusSuccess"
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(safetyCheckResult)
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
