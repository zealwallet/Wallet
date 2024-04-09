import { FormattedDate } from 'react-intl'

import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'

import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

type Props = {
    nowTimestampMs: number
    submittedTransaction: SubmitedTransaction
}

export const Timing = ({ nowTimestampMs, submittedTransaction }: Props) => {
    const formatHumanReadableDuration = useReadableDuration()

    switch (submittedTransaction.state) {
        case 'queued':
        case 'included_in_block':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                >
                    {formatHumanReadableDuration(
                        nowTimestampMs - submittedTransaction.queuedAt,
                        'floor'
                    )}
                </Text>
            )
        case 'completed':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusSuccessOnColor"
                >
                    <FormattedDate
                        value={submittedTransaction.completedAt}
                        month="short"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                        hour12={false}
                    />
                </Text>
            )
        case 'failed':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusCriticalOnColor"
                >
                    <FormattedDate
                        value={submittedTransaction.failedAt}
                        month="short"
                        day="2-digit"
                        hour="2-digit"
                        minute="2-digit"
                        hour12={false}
                    />
                </Text>
            )

        case 'replaced':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(submittedTransaction)
    }
}
