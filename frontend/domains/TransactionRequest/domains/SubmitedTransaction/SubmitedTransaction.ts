export type SubmitedTransaction =
    | SubmitedTransactionQueued
    | SubmitedTransactionIncludedInBlock
    | SubmitedTransactionCompleted
    | SubmitedTransactionFailed
    | SubmitedTransactionReplaced

export type SubmitedTransactionQueued = {
    hash: string
    submittedNonce: number
    state: 'queued'
    queuedAt: number
}

export type SubmitedTransactionReplaced = {
    hash: string
    submittedNonce: number
    transactionCount: number
    state: 'replaced'
    queuedAt: number
}

export type SubmitedTransactionIncludedInBlock = {
    hash: string
    submittedNonce: number
    state: 'included_in_block'
    queuedAt: number
    gasInfo: GasInfo
}

export type SubmitedTransactionCompleted = {
    hash: string
    submittedNonce: number
    state: 'completed'
    queuedAt: number
    completedAt: number
    gasInfo: GasInfo
}

export type SubmitedTransactionFailed = {
    hash: string
    submittedNonce: number
    state: 'failed'
    queuedAt: number
    failedAt: number
    gasInfo: GasInfo
}

export type GasInfo =
    | { type: 'generic'; gasUsed: bigint; effectiveGasPrice: bigint }
    | {
          type: 'l2_rollup'
          l1Fee: bigint
          l1FeeScalar: number
          l1GasPrice: bigint
          l1GasUsed: bigint
          gasUsed: bigint
          l2GasPrice: bigint
      }
