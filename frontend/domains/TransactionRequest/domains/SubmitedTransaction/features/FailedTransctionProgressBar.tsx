import { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Progress } from '@zeal/uikit/Progress'
import { Skeleton } from '@zeal/uikit/Skeleton'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Failed, Loaded } from '@zeal/toolkit/LoadableData/Primitive'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedTransactionFailed } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { SubmittedSafeTransactionFailed } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { HashLink } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/components/HashLink'
import {
    FailureReason,
    fetchFailureReason,
} from '@zeal/domains/Transactions/api/fetchFailureReason'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    failedTransaction:
        | SubmitedTransactionFailed
        | SubmittedSafeTransactionFailed
}

export const FailedTransctionProgressBar = ({
    failedTransaction,
    network,
    networkRPCMap,
}: Props) => {
    const { formatMessage } = useIntl()
    const transactionHash = failedTransaction.hash

    const [loadable] = useLoadableData(fetchFailureReason, {
        type: 'loading',
        params: {
            network,
            networkRPCMap,
            transactionHash: { transactionHash: failedTransaction.hash },
        },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break

            case 'loaded':
                switch (loadable.data.type) {
                    case 'out_of_gas':
                        captureError(
                            new ImperativeError(
                                'Transaction failed with out of gas error',
                                { transactionHash }
                            )
                        )
                        break
                    case 'execution_reverted':
                    case 'execution_reverted_without_message':
                        break

                    /* istanbul ignore next */
                    default:
                        notReachable(loadable.data)
                }
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable, transactionHash])

    const getMessage = (
        loadalbleData: Failed<unknown> | Loaded<FailureReason, unknown>
    ): {
        title: string
        subtitle: string | null
    } => {
        switch (loadalbleData.type) {
            case 'loaded':
                switch (loadalbleData.data.type) {
                    case 'out_of_gas':
                        return {
                            title: formatMessage({
                                id: 'submitTransaction.failed.out_of_gas.title',
                                defaultMessage: 'Network error',
                            }),
                            subtitle: formatMessage({
                                id: 'submitTransaction.failed.out_of_gas.description',
                                defaultMessage:
                                    'Network cancelled transaction because it used more network fees than expected',
                            }),
                        }

                    case 'execution_reverted':
                        return {
                            title: formatMessage({
                                id: 'submitTransaction.failed.execution_reverted.title',
                                defaultMessage: 'The app had an error',
                            }),
                            subtitle: loadalbleData.data.message,
                        }

                    case 'execution_reverted_without_message':
                        return {
                            title: formatMessage({
                                id: 'submitTransaction.failed.execution_reverted_without_message.title',
                                defaultMessage: 'The app had an error',
                            }),
                            subtitle: null,
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(loadalbleData.data)
                }

            case 'error':
                return {
                    title: formatMessage({
                        id: 'submitTransaction.failed.banner.title',
                        defaultMessage: 'Transaction failed',
                    }),
                    subtitle: formatMessage({
                        id: 'submitTransaction.failed.banner.description',
                        defaultMessage:
                            'The network cancelled this transaction unexpectedly. Try again or contact us.',
                    }),
                }

            /* istanbul ignore next */
            default:
                return notReachable(loadalbleData)
        }
    }

    switch (loadable.type) {
        case 'loading':
            return (
                <Progress
                    variant="critical"
                    title={<Skeleton variant="default" width={75} />}
                    subtitle={<Skeleton variant="default" width={55} />}
                    right={
                        <HashLink
                            variant="with_address"
                            submitedTransaction={failedTransaction}
                            network={network}
                        />
                    }
                    initialProgress={null}
                    progress={100}
                />
            )

        case 'loaded':
        case 'error': {
            const { subtitle, title } = getMessage(loadable)

            return (
                <Progress
                    variant="critical"
                    title={title}
                    subtitle={subtitle}
                    right={
                        <HashLink
                            variant="with_address"
                            submitedTransaction={failedTransaction}
                            network={network}
                        />
                    }
                    initialProgress={null}
                    progress={100}
                />
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
