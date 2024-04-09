import { FormattedMessage } from 'react-intl'

import { BoldCrossOctagon } from '@zeal/uikit/Icon/BoldCrossOctagon'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { HashLink } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/HashLink'
import { FailedTransctionProgressBar } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/features/FailedTransctionProgressBar'

type Props = {
    submitedTransaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
}

export const CancelProgressStatusBar = ({
    network,
    networkRPCMap,
    submitedTransaction,
}: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'replaced':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.cancel.attemptingToStop"
                            defaultMessage="Attempting to stop"
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <Spinner size={16} />
                            <HashLink
                                variant="with_address"
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                        </Row>
                    }
                    initialProgress={10}
                    progress={60}
                />
            )

        case 'failed':
            return (
                <FailedTransctionProgressBar
                    failedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                />
            )

        case 'completed':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.cancelled"
                            defaultMessage="Stopped"
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <BoldCrossOctagon
                                size={16}
                                color="iconStatusNeutralOnColor"
                            />
                            <HashLink
                                variant="with_address"
                                submitedTransaction={submitedTransaction}
                                network={network}
                            />
                        </Row>
                    }
                    initialProgress={null}
                    progress={100}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedTransaction)
    }
}
