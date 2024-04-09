import { FormattedMessage } from 'react-intl'

import { CheckMarkCircle } from '@zeal/uikit/Icon/CheckMarkCircle'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Spinner } from '@zeal/uikit/Spinner'

import { notReachable } from '@zeal/toolkit'
import { RangeInt } from '@zeal/toolkit/Range'

import { Network } from '@zeal/domains/Network'

import { HashLink } from './HashLink'

import { SubmittedUserOperation } from '../SubmittedUserOperation'

type Props = {
    submittedUserOperation: SubmittedUserOperation
    network: Network
    queuedInitialProgress: RangeInt<0, 100> | null
}

export const ProgressStatusBar = ({
    submittedUserOperation,
    network,
    queuedInitialProgress,
}: Props) => {
    switch (submittedUserOperation.state) {
        case 'pending':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitted-user-operation.state.pending"
                            defaultMessage="Relaying"
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <Spinner size={16} />
                            <HashLink
                                variant="with_address"
                                submittedUserOperation={submittedUserOperation}
                                network={network}
                            />
                        </Row>
                    }
                    initialProgress={queuedInitialProgress}
                    progress={60}
                />
            )

        case 'bundled':
            return (
                <Progress
                    variant="neutral"
                    title={
                        <FormattedMessage
                            id="submitted-user-operation.state.bundled"
                            defaultMessage="Queueing"
                        />
                    }
                    right={
                        <Row spacing={4}>
                            <Spinner size={16} />
                            <HashLink
                                variant="with_address"
                                submittedUserOperation={submittedUserOperation}
                                network={network}
                            />
                        </Row>
                    }
                    initialProgress={queuedInitialProgress}
                    progress={80}
                />
            )

        case 'completed':
            return (
                <Progress
                    variant="success"
                    title={
                        <FormattedMessage
                            id="submitted-user-operation.state.completed"
                            defaultMessage="Completed"
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
                                submittedUserOperation={submittedUserOperation}
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
                <Progress
                    variant="critical"
                    title={
                        <FormattedMessage
                            id="submitted-user-operation.state.failed"
                            defaultMessage="Failed"
                        />
                    }
                    subtitle={submittedUserOperation.message}
                    right={
                        <HashLink
                            variant="with_address"
                            submittedUserOperation={submittedUserOperation}
                            network={network}
                        />
                    }
                    initialProgress={null}
                    progress={100}
                />
            )

        case 'rejected':
            return (
                <Progress
                    variant="critical"
                    title={
                        <FormattedMessage
                            id="submitted-user-operation.state.rejected"
                            defaultMessage="Rejected"
                        />
                    }
                    right={
                        <HashLink
                            variant="with_address"
                            submittedUserOperation={submittedUserOperation}
                            network={network}
                        />
                    }
                    initialProgress={null}
                    progress={100}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(submittedUserOperation)
    }
}
