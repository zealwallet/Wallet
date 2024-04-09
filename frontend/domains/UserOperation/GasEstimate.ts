export type BundlerGasEstimate = {
    callGasLimit: bigint
    verificationGasLimit: bigint
    preVerificationGas: bigint
}

export type BundlerGasPrice = {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
}
