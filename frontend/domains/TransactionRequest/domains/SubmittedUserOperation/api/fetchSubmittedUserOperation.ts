import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    match,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import {
    SubmittedUserOperation,
    SubmittedUserOperationBundled,
    SubmittedUserOperationCompleted,
    SubmittedUserOperationFailed,
    SubmittedUserOperationPending,
    SubmittedUserOperationRejected,
} from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { fetchBundlerResponse } from '@zeal/domains/UserOperation/api/fetchBundlerResponse'

const parsePending = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationPending> =>
    object(input).andThen((obj) =>
        shape({
            state: match(obj.state, 'BUNDLER_MEMPOOL').map(
                () => 'pending' as const
            ),
            userOperationHash: success(
                submittedUserOperation.userOperationHash
            ),
            sender: success(submittedUserOperation.sender),
            queuedAt: success(submittedUserOperation.queuedAt),
        })
    )

const parseBundled = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationBundled> =>
    object(input).andThen((obj) =>
        shape({
            state: match(obj.state, 'SUBMITTED').map(() => 'bundled' as const),
            userOperationHash: success(
                submittedUserOperation.userOperationHash
            ),
            sender: success(submittedUserOperation.sender),
            queuedAt: success(submittedUserOperation.queuedAt),
            bundleTransactionHash: string(obj.transactionHash),
        })
    )

const parseCompleted = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationCompleted> =>
    object(input)
        .andThen((obj) =>
            shape({
                state: match(obj.state, 'CONFIRMED'),
                userOperationReceipt: object(obj.userOperationReceipt).andThen(
                    (userOpReceiptObj) =>
                        shape({
                            success: match(userOpReceiptObj.success, 'true'),
                            receipt: object(userOpReceiptObj.receipt).andThen(
                                (receiptObj) =>
                                    shape({
                                        transactionHash: string(
                                            receiptObj.transactionHash
                                        ),
                                    })
                            ),
                        })
                ),
            })
        )
        .map((result) => ({
            state: 'completed' as const,
            userOperationHash: submittedUserOperation.userOperationHash,
            sender: submittedUserOperation.sender,
            queuedAt: submittedUserOperation.queuedAt,
            bundleTransactionHash:
                result.userOperationReceipt.receipt.transactionHash,
            completedAt: Date.now(),
        }))

const parseRejected = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationRejected> =>
    object(input).andThen((obj) =>
        shape({
            state: match(obj.state, 'DROPPED_FROM_BUNDLER_MEMPOOL').map(
                () => 'rejected' as const
            ),
            userOperationHash: success(
                submittedUserOperation.userOperationHash
            ),
            sender: success(submittedUserOperation.sender),
            queuedAt: success(submittedUserOperation.queuedAt),
            rejectedAt: success(Date.now()),
        })
    )

const parseBundleTransactionFailed = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationFailed> =>
    object(input).andThen((obj) =>
        shape({
            state: match(obj.state, 'FAILED').map(() => 'failed' as const),
            userOperationHash: success(
                submittedUserOperation.userOperationHash
            ),
            sender: success(submittedUserOperation.sender),
            queuedAt: success(submittedUserOperation.queuedAt),
            bundleTransactionHash: string(obj.transactionHash),
            message: string(obj.message),
            failedAt: success(Date.now()),
        })
    )

const parseUserOperationFailed = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationFailed> =>
    object(input)
        .andThen((obj) =>
            shape({
                state: match(obj.state, 'CONFIRMED'),
                userOperationReceipt: object(obj.userOperationReceipt).andThen(
                    (userOpReceiptObj) =>
                        shape({
                            success: match(userOpReceiptObj.success, 'false'),
                            receipt: object(userOpReceiptObj.receipt).andThen(
                                (receiptObj) =>
                                    shape({
                                        transactionHash: string(
                                            receiptObj.transactionHash
                                        ),
                                    })
                            ),
                        })
                ),
            })
        )
        .map((result) => ({
            state: 'failed' as const,
            userOperationHash: submittedUserOperation.userOperationHash,
            sender: submittedUserOperation.sender,
            queuedAt: submittedUserOperation.queuedAt,
            bundleTransactionHash:
                result.userOperationReceipt.receipt.transactionHash,
            message: 'Operation was unsuccessful',
            failedAt: Date.now(),
        }))

const parseFailed = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperationFailed> =>
    oneOf(input, [
        parseUserOperationFailed(input, submittedUserOperation),
        parseBundleTransactionFailed(input, submittedUserOperation),
    ])

const parse = (
    input: unknown,
    submittedUserOperation: SubmittedUserOperation
): Result<unknown, SubmittedUserOperation> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            parsePending(obj, submittedUserOperation),
            parseBundled(obj, submittedUserOperation),
            parseCompleted(obj, submittedUserOperation),
            parseRejected(obj, submittedUserOperation),
            parseFailed(obj, submittedUserOperation),
        ])
    )

export const fetchSubmittedUserOperation = async ({
    submittedUserOperation,
    network,
    signal,
}: {
    submittedUserOperation: SubmittedUserOperation
    network: Network
    signal?: AbortSignal
}): Promise<SubmittedUserOperation> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            return await fetchBundlerResponse({
                network,
                signal,
                request: {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0',
                    method: 'biconomy_getUserOperationStatus',
                    params: [submittedUserOperation.userOperationHash],
                },
            }).then((response) =>
                parse(response, submittedUserOperation).getSuccessResultOrThrow(
                    'Failed to parse submitted user operation status'
                )
            )
        }
        case 'custom':
            throw new ImperativeError(
                'Cannot fetch submitted user operation on custom network'
            ) // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
