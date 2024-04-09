import { post } from '@zeal/api/request'

import { failure, object, Result, success } from '@zeal/toolkit/Result'

import { PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'

export type BundlerRequest =
    | EthEstimateUserOperationGas
    | BiconomyGetGasFeeValues
    | EthSendUserOperation
    | BiconomyGetUserOperationStatus

export type EthEstimateUserOperationGas = {
    method: 'eth_estimateUserOperationGas'
    params: [
        {
            sender: string
            callData: string
            nonce: string
            initCode: string // 0x if null
            paymasterAndData: string // can set to 0x
            signature: string // this should be a dummy signature
        },
        string // entrypoint address
    ]
} & Common

export type BiconomyGetGasFeeValues = {
    method: 'biconomy_getGasFeeValues'
    params: []
} & Common

export type EthSendUserOperation = {
    method: 'eth_sendUserOperation'
    params: [
        {
            sender: string
            nonce: string
            initCode: string // 0x if null
            callData: string
            callGasLimit: string
            verificationGasLimit: string
            preVerificationGas: string
            maxPriorityFeePerGas: string
            maxFeePerGas: string
            paymasterAndData: string
            signature: string
        },
        string // entrypoint address
    ]
} & Common

export type BiconomyGetUserOperationStatus = {
    method: 'biconomy_getUserOperationStatus'
    params: [string] // userOperationHash
} & Common

type Common = {
    id: number | string
    jsonrpc: '2.0'
}

const parseBundlerResponse = (input: unknown): Result<unknown, unknown> =>
    object(input).andThen((obj) =>
        obj.error ? failure(obj.error) : success(obj.result)
    )

export const fetchBundlerResponse = async ({
    request,
    network,
    signal,
}: {
    request: BundlerRequest
    network: PredefinedNetwork | TestNetwork
    signal?: AbortSignal
}): Promise<unknown> =>
    post(
        '/wallet/rpc/bundler/',
        {
            query: { network: network.name },
            body: request,
        },
        signal
    ).then((response) =>
        parseBundlerResponse(response).getSuccessResultOrThrow(
            'Failed to parse bundler response'
        )
    )
