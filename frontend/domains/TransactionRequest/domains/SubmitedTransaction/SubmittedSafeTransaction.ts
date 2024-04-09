export type SubmittedSafeTransaction =
    | SubmittedSafeTransactionQueued
    | SubmittedSafeTransactionIncludedInBlock
    | SubmittedSafeTransactionCompleted
    | SubmittedSafeTransactionFailed

export type SubmittedSafeTransactionQueued = {
    hash: string
    state: 'queued'
    queuedAt: number
}

export type SubmittedSafeTransactionIncludedInBlock = {
    hash: string
    state: 'included_in_block'
    queuedAt: number
}

export type SubmittedSafeTransactionCompleted = {
    hash: string
    state: 'completed'
    queuedAt: number
    completedAt: number
}

export type SubmittedSafeTransactionFailed = {
    hash: string
    state: 'failed'
    queuedAt: number
    failedAt: number
}
