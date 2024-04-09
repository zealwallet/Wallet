import { FormattedMessage } from 'react-intl'

import { Actions as UIActions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'

import { notReachable } from '@zeal/toolkit'

import { SubmittedToBundlerUserOperationRequest } from '@zeal/domains/TransactionRequest'
import {
    SubmittedUserOperation,
    SubmittedUserOperationCompleted,
    SubmittedUserOperationFailed,
    SubmittedUserOperationRejected,
} from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'

import { FeeBanner } from './FinalFeeBanner'

type Props = {
    userOperationRequest: SubmittedToBundlerUserOperationRequest
    submittedUserOperation: SubmittedUserOperation
    onMsg: (msg: Msg) => void
}

export type Msg =
    | {
          type: 'on_completed_safe_transaction_close_click'
          completedTransaction: SubmittedUserOperationCompleted
      }
    | {
          type: 'on_safe_transaction_failure_accepted'
          failedTransaction:
              | SubmittedUserOperationRejected
              | SubmittedUserOperationFailed
      }

export const Actions = ({
    userOperationRequest,
    submittedUserOperation,
    onMsg,
}: Props) => {
    switch (submittedUserOperation.state) {
        case 'pending':
        case 'bundled':
            return (
                <UIActions>
                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <Button size="regular" variant="secondary" disabled>
                        <FormattedMessage
                            id="submitTransaction.submit"
                            defaultMessage="Submit"
                        />
                    </Button>
                </UIActions>
            )

        case 'completed':
            return (
                <Column spacing={12}>
                    <FeeBanner
                        network={userOperationRequest.network}
                        sender={userOperationRequest.account.address}
                        submittedUserOperation={submittedUserOperation}
                    />

                    <UIActions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'on_completed_safe_transaction_close_click',
                                    completedTransaction:
                                        submittedUserOperation,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.close"
                                defaultMessage="Close"
                            />
                        </Button>
                    </UIActions>
                </Column>
            )

        case 'failed':
            return (
                <Column spacing={12}>
                    <FeeBanner
                        network={userOperationRequest.network}
                        sender={userOperationRequest.account.address}
                        submittedUserOperation={submittedUserOperation}
                    />

                    <UIActions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'on_safe_transaction_failure_accepted',
                                    failedTransaction: submittedUserOperation,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.close"
                                defaultMessage="Close"
                            />
                        </Button>
                    </UIActions>
                </Column>
            )
        case 'rejected':
            return (
                <Column spacing={12}>
                    <UIActions>
                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() =>
                                onMsg({
                                    type: 'on_safe_transaction_failure_accepted',
                                    failedTransaction: submittedUserOperation,
                                })
                            }
                        >
                            <FormattedMessage
                                id="action.close"
                                defaultMessage="Close"
                            />
                        </Button>
                    </UIActions>
                </Column>
            )

        default:
            return notReachable(submittedUserOperation)
    }
}
