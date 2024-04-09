import React from 'react'

import { Color } from '@zeal/uikit/colors'
import { BoldShieldCaution } from '@zeal/uikit/Icon/BoldShieldCaution'
import { ShieldDone } from '@zeal/uikit/Icon/ShieldDone'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'

import { notReachable } from '@zeal/toolkit'

import { SafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyCheck: SafetyCheck
    size: number
}

export const getColor = (safetyCheck: SafetyCheck): Color => {
    switch (safetyCheck.state) {
        case 'Failed':
            switch (safetyCheck.severity) {
                case 'Caution':
                    return 'statusWarning'

                case 'Danger':
                    return 'statusCritical'

                default:
                    return notReachable(safetyCheck.severity)
            }

        case 'Passed':
            return 'statusSuccess'

        default:
            return notReachable(safetyCheck)
    }
}

export const Icon = ({ safetyCheck, size }: Props) => {
    const color = getColor(safetyCheck)

    switch (safetyCheck.state) {
        case 'Failed':
            switch (safetyCheck.severity) {
                case 'Caution':
                    return <BoldShieldCaution size={size} color={color} />

                case 'Danger':
                    return <ShieldFail size={size} color={color} />

                default:
                    return notReachable(safetyCheck.severity)
            }

        case 'Passed':
            return <ShieldDone size={size} color={color} />

        default:
            return notReachable(safetyCheck)
    }
}
