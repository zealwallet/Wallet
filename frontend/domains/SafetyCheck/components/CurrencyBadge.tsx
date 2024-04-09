import React from 'react'

import { BadgeSize } from '@zeal/uikit/Avatar'
import { BoldShieldCautionWithBorder } from '@zeal/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from '@zeal/uikit/Icon/BoldShieldDoneWithBorder'

import { notReachable } from '@zeal/toolkit'

import { CurrencyId } from '@zeal/domains/Currency'
import {
    SignMessageSafetyCheck,
    TransactionSafetyCheck,
} from '@zeal/domains/SafetyCheck'

export const CurrencyBadge = ({
    size,
    currencyId,
    safetyChecks,
}: {
    size: BadgeSize
    currencyId: CurrencyId | null
    safetyChecks: Array<TransactionSafetyCheck | SignMessageSafetyCheck>
}) => {
    // We do not render badge if it's currency not from dictionary
    if (!currencyId) {
        return null
    }

    const check = safetyChecks.find((item) => {
        switch (item.type) {
            case 'TokenVerificationCheck':
                return item.currencyId === currencyId

            case 'TransactionSimulationCheck':
            case 'SmartContractBlacklistCheck':
            case 'NftCollectionCheck':
            case 'P2pReceiverTypeCheck':
            case 'ApprovalSpenderTypeCheck':
            case 'ApprovalExpirationLimitCheck':
                return false

            /* istanbul ignore next */
            default:
                return notReachable(item)
        }
    })

    if (!check) {
        // We do not render badge if no match
        return null
    }

    switch (check.state) {
        case 'Failed':
            return (
                <BoldShieldCautionWithBorder
                    size={size}
                    color="statusWarning"
                />
            )

        case 'Passed':
            return (
                <BoldShieldDoneWithBorder size={size} color="statusSuccess" />
            )

        /* istanbul ignore next */
        default:
            return notReachable(check)
    }
}
