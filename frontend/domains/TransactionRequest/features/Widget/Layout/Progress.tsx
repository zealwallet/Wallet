import React from 'react'

import { ProgressThin } from '@zeal/uikit/ProgressThin'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'

import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

type Props = {
    submitedTransaction: SubmitedTransaction
}

const progress = (
    submitedTransaction: SubmitedTransaction
): RangeInt<0, 100> => {
    switch (submitedTransaction.state) {
        case 'queued':
            return 60

        case 'included_in_block':
            return 80

        case 'completed':
        case 'failed':
        case 'replaced':
            return 100

        default:
            return notReachable(submitedTransaction)
    }
}

const background = (
    submitedTransaction: SubmitedTransaction
): React.ComponentProps<typeof ProgressThin>['background'] => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return 'neutral'

        case 'completed':
            return 'success'

        case 'failed':
            return 'critical'
        case 'replaced':
            return 'warning'

        default:
            return notReachable(submitedTransaction)
    }
}

export const Progress = ({ submitedTransaction }: Props) => (
    <ProgressThin
        progress={progress(submitedTransaction)}
        initialProgress={null}
        animationTimeMs={300}
        background={background(submitedTransaction)}
    />
)
