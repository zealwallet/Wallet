import React from 'react'

import { Color } from '@zeal/uikit/colors'
import { Step } from '@zeal/uikit/Icon/Step'
import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

type State = 'warning' | 'primary' | 'error'

const getStepColor = (state: State, index: number, progress: number): Color => {
    if (index >= progress) {
        return 'iconDefault'
    }

    switch (state) {
        case 'warning':
            return 'iconStatusWarning'
        case 'primary':
            return 'iconAccent2'
        case 'error':
            return 'iconStatusCritical'
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export const Steps = ({
    length,
    state,
    progress,
}: {
    length: number
    progress: number
    state: State
}) => (
    <Row spacing={24}>
        {Array.from({ length }, (_, index) => (
            <Step
                key={index}
                color={getStepColor(state, index, progress)}
                size={16}
            />
        ))}
    </Row>
)
