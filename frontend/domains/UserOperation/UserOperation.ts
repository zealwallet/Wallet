import { Hexadecimal } from '@zeal/toolkit/Hexadecimal'

import { Address } from '@zeal/domains/Address'

export type InitialUserOperation = {
    type: 'initial_user_operation'
    sender: Address
    callData: string // addOwner + tx || tx
    nonce: bigint
    entrypoint: Address

    initCode: string | null // if we need to deploy, this going to be set to something
}

export type UserOperationWithoutSignature = {
    type: 'user_operation_without_signature'
    sender: Address
    callData: string
    nonce: bigint
    entrypoint: Address

    initCode: string | null

    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint

    callGasLimit: bigint // if we need to deploy we need to add here passkeysigner overhead
    verificationGasLimit: bigint
    preVerificationGas: bigint

    paymasterAndData: string | null
}

export type UserOperationWithSignature = {
    type: 'user_operation_with_signature'
    sender: Address
    callData: string
    nonce: bigint
    entrypoint: Address

    signature: string

    initCode: string | null

    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint

    callGasLimit: bigint
    verificationGasLimit: bigint
    preVerificationGas: bigint

    paymasterAndData: string | null
}

export type UserOperationHash = {
    type: 'user_operation_hash'

    encodedValidFrom: Hexadecimal
    encodedValidUntil: Hexadecimal
    hash: Hexadecimal
}
