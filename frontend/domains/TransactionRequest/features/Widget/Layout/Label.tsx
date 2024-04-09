import { FormattedMessage } from 'react-intl'

import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Network } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

import { CompletedLabel } from './CompletedLabel'

type Props = { submitedTransaction: SubmitedTransaction; network: Network }

export const Label = ({ submitedTransaction, network }: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                >
                    <FormattedMessage
                        id="submitTransaction.state.addedToQueue"
                        defaultMessage="Queued"
                    />
                </Text>
            )

        case 'included_in_block':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusNeutralOnColor"
                >
                    <FormattedMessage
                        id="submitTransaction.state.includedInBlock"
                        defaultMessage="In block"
                    />
                </Text>
            )

        case 'replaced':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusWarningOnColor"
                >
                    <FormattedMessage
                        id="submitTransaction.state.replaced"
                        defaultMessage="Replaced"
                    />
                </Text>
            )

        case 'completed':
            return (
                <CompletedLabel
                    completedTransaction={submitedTransaction}
                    network={network}
                />
            )

        case 'failed':
            return (
                <Text
                    variant="footnote"
                    weight="regular"
                    color="textStatusCriticalOnColor"
                >
                    <FormattedMessage
                        id="submitTransaction.state.failed"
                        defaultMessage="Failed"
                    />
                </Text>
            )

        default:
            return notReachable(submitedTransaction)
    }
}
