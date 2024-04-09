import { FormattedMessage } from 'react-intl'

import { CheckMarkCircle } from '@zeal/uikit/Icon/CheckMarkCircle'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { HashLink } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/HashLink'
import { FailedTransctionProgressBar } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/features/FailedTransctionProgressBar'

import { SubmittedSafeTransaction } from '../SubmittedSafeTransaction'

type Props = {
    submitedTransaction: SubmitedTransaction | SubmittedSafeTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    queuedInitialProgress: RangeInt<0, 100> | null
}

export const ProgressStatusBar = ({
    network,
    networkRPCMap,
    submitedTransaction,
    queuedInitialProgress,
}: Props) => {
    switch (submitedTransaction.state) {
        case 'queued':
        case 'replaced':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.addedToQueue"
                            defaultMessage="Added to queue"
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
                    initialProgress={queuedInitialProgress}
                    progress={60}
                />
            )

        case 'included_in_block':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.includedInBlock"
                            defaultMessage="Included in block"
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
                    initialProgress={null}
                    progress={80}
                />
            )

        case 'completed':
            return (
                <Progress
                    variant="success"
                    title={
                        <FormattedMessage
                            id="submitTransaction.state.complete"
                            defaultMessage="Complete"
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <CheckMarkCircle
                                size={16}
                                color="iconStatusSuccessOnColor"
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

        case 'failed':
            return (
                <FailedTransctionProgressBar
                    failedTransaction={submitedTransaction}
                    network={network}
                    networkRPCMap={networkRPCMap}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(submitedTransaction)
    }
}
