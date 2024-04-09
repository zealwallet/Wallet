import { Address } from '@zeal/domains/Address'

export type SubmittedUserOperation =
    | SubmittedUserOperationPending
    | SubmittedUserOperationBundled
    | SubmittedUserOperationCompleted
    | SubmittedUserOperationRejected
    | SubmittedUserOperationFailed

export type SubmittedUserOperationPending = {
    userOperationHash: string
    sender: Address
    state: 'pending'
    queuedAt: number
}

export type SubmittedUserOperationBundled = {
    userOperationHash: string
    bundleTransactionHash: string
    sender: Address
    state: 'bundled'
    queuedAt: number
}

export type SubmittedUserOperationCompleted = {
    userOperationHash: string
    bundleTransactionHash: string
    sender: Address
    state: 'completed'
    queuedAt: number
    completedAt: number
}

export type SubmittedUserOperationRejected = {
    userOperationHash: string
    sender: Address
    state: 'rejected'
    queuedAt: number
    rejectedAt: number
}

export type SubmittedUserOperationFailed = {
    userOperationHash: string
    bundleTransactionHash: string
    message: string
    sender: Address
    state: 'failed'
    queuedAt: number
    failedAt: number
}
