import {
    bigint,
    match,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    GasInfo,
    SubmitedTransaction,
    SubmitedTransactionCompleted,
    SubmitedTransactionFailed,
    SubmitedTransactionIncludedInBlock,
    SubmitedTransactionQueued,
} from '../SubmitedTransaction'

const parseQueued = (
    input: unknown
): Result<unknown, SubmitedTransactionQueued> =>
    object(input).andThen((obj) =>
        shape({
            hash: string(obj.hash),
            state: match(obj.state, 'queued' as const),
            queuedAt: number(obj.queuedAt),
            submittedNonce: number(obj.submittedNonce),
        })
    )

export const parseGasInfo = (input: unknown): Result<unknown, GasInfo> =>
    object(input).andThen((dto) =>
        oneOf(dto, [
            shape({
                type: success('l2_rollup' as const),
                l1Fee: bigint(dto.l1Fee),
                l1FeeScalar: string(dto.l1FeeScalar).map((str) =>
                    parseFloat(str)
                ),
                l1GasPrice: bigint(dto.l1GasPrice),
                l1GasUsed: bigint(dto.l1GasUsed),
                l2GasPrice: bigint(dto.effectiveGasPrice),
                gasUsed: bigint(dto.gasUsed),
            }),
            shape({
                type: success('l2_rollup' as const),
                l1Fee: bigint(dto.l1Fee),
                l1FeeScalar: string(dto.l1FeeScalar).map((str) =>
                    parseFloat(str)
                ),
                l1GasPrice: bigint(dto.l1GasPrice),
                l1GasUsed: bigint(dto.l1GasUsed),
                l2GasPrice: bigint(dto.l2GasPrice),
                gasUsed: bigint(dto.gasUsed),
            }),
            shape({
                type: success('generic' as const),
                effectiveGasPrice: bigint(dto.effectiveGasPrice),
                gasUsed: bigint(dto.gasUsed),
            }),
        ])
    )

const parseIncludedInBlock = (
    input: unknown
): Result<unknown, SubmitedTransactionIncludedInBlock> =>
    object(input).andThen((obj) =>
        shape({
            hash: string(obj.hash),
            state: match(obj.state, 'included_in_block' as const),
            queuedAt: number(obj.queuedAt),
            gasInfo: parseGasInfo(obj.gasInfo),
            submittedNonce: number(obj.submittedNonce),
        })
    )

const parseCompleted = (
    input: unknown
): Result<unknown, SubmitedTransactionCompleted> =>
    object(input).andThen((obj) =>
        shape({
            hash: string(obj.hash),
            state: match(obj.state, 'completed' as const),
            queuedAt: number(obj.queuedAt),
            completedAt: number(obj.completedAt),
            gasInfo: parseGasInfo(obj.gasInfo),
            submittedNonce: number(obj.submittedNonce),
        })
    )

const parseFailed = (
    input: unknown
): Result<unknown, SubmitedTransactionFailed> =>
    object(input).andThen((obj) =>
        shape({
            hash: string(obj.hash),
            state: match(obj.state, 'failed' as const),
            queuedAt: number(obj.queuedAt),
            failedAt: number(obj.failedAt),
            gasInfo: parseGasInfo(obj.gasInfo),
            submittedNonce: number(obj.submittedNonce),
        })
    )

export const parseSubmitedTransaction = (
    input: unknown
): Result<unknown, SubmitedTransaction> =>
    oneOf(input, [
        parseQueued(input),
        parseIncludedInBlock(input),
        parseCompleted(input),
        parseFailed(input),
    ])
