import React from 'react'

import { BadgeSize } from '@zeal/uikit/Avatar'
import { BoldShieldCautionWithBorder } from '@zeal/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDangerWithBorder } from '@zeal/uikit/Icon/BoldShieldDangerWithBorder'
import { BoldShieldDoneWithBorder } from '@zeal/uikit/Icon/BoldShieldDoneWithBorder'

import { notReachable } from '@zeal/toolkit'

import {
    SignMessageSafetyCheck,
    TransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'

const sortBySeverity = (
    a: TransactionSafetyCheck | SignMessageSafetyCheck,
    b: TransactionSafetyCheck | SignMessageSafetyCheck
) => {
    switch (a.severity) {
        case 'Caution': {
            switch (b.severity) {
                case 'Caution':
                    return 0
                case 'Danger':
                    return 1
                /* istanbul ignore next */
                default:
                    return notReachable(b.severity)
            }
        }
        case 'Danger': {
            switch (b.severity) {
                case 'Caution':
                    return -1
                case 'Danger':
                    return 0
                /* istanbul ignore next */
                default:
                    return notReachable(b.severity)
            }
        }
        /* istanbul ignore next */
        default:
            return notReachable(a.severity)
    }
}

export const SmartContractBadge = ({
    size,
    safetyChecks,
}: {
    size: BadgeSize
    safetyChecks: Array<TransactionSafetyCheck | SignMessageSafetyCheck>
}) => {
    const contractChecks = safetyChecks.filter((check) => {
        switch (check.type) {
            case 'SmartContractBlacklistCheck':
            case 'ApprovalSpenderTypeCheck':
                return true
            case 'P2pReceiverTypeCheck':
            case 'TransactionSimulationCheck':
            case 'TokenVerificationCheck':
            case 'NftCollectionCheck':
            case 'ApprovalExpirationLimitCheck':
                return false
            /* istanbul ignore next */
            default:
                return notReachable(check)
        }
    })

    const failedContractChecks = contractChecks.filter((check) => {
        switch (check.state) {
            case 'Passed':
                return false
            case 'Failed':
                return true
            /* istanbul ignore next */
            default:
                return notReachable(check)
        }
    })

    if (!failedContractChecks.length) {
        return <BoldShieldDoneWithBorder size={size} color="statusSuccess" />
    }

    const sortedBySeverity = failedContractChecks.sort(sortBySeverity)

    switch (sortedBySeverity[0].severity) {
        case 'Caution':
            return (
                <BoldShieldCautionWithBorder
                    size={size}
                    color="statusWarning"
                />
            )
        case 'Danger':
            return (
                <BoldShieldDangerWithBorder
                    size={size}
                    color="statusCritical"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(sortedBySeverity[0].severity)
    }
}
