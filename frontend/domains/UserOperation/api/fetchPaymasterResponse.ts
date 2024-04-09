import { post } from '@zeal/api/request'

import { failure, object, Result, success } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'

export type PaymasterRequest =
    | PaymasterGetFeeQuoteOrData
    | PaymasterSponsorUserOperation

export type PaymasterGetFeeQuoteOrData = {
    method: 'pm_getFeeQuoteOrData'
    params: [
        {
            sender: string
            callData: string
            nonce: string
            initCode: string // 0x if null
            paymasterAndData: string // can set to 0x
            callGasLimit: string // Should be number in string format (not hex)
            verificationGasLimit: string // Should be number in string format (not hex)
            preVerificationGas: string // Should be number in string format (not hex)
            maxPriorityFeePerGas: string
            maxFeePerGas: string
            signature: string // this should be a dummy signature
        },
        { mode: 'ERC20'; tokenInfo: { tokenList: Address[] } }
    ]
} & Common

export type PaymasterSponsorUserOperation = {
    method: 'pm_sponsorUserOperation'
    params: [
        {
            sender: string
            callData: string
            nonce: string
            initCode: string // 0x if null
            maxPriorityFeePerGas: string
            maxFeePerGas: string
            callGasLimit: string // Should be number in string format (not hex)
            verificationGasLimit: string // Should be number in string format (not hex)
            preVerificationGas: string // Should be number in string format (not hex)
            signature?: string // this should be a dummy signature
        },
        (
            | {
                  mode: 'ERC20'
                  calculateGasLimits: boolean
                  tokenInfo: {
                      feeTokenAddress: Address
                  }
              }
            | {
                  mode: 'SPONSORED'
                  calculateGasLimits: boolean
                  sponsorshipInfo: {
                      smartAccountInfo: {
                          name: 'BICONOMY'
                          version: '2.0.0'
                      }
                  }
              }
        )
    ]
} & Common

type Common = {
    id: number | string
    jsonrpc: '2.0'
}

const parsePaymasterResponse = (input: unknown): Result<unknown, unknown> =>
    object(input).andThen((obj) =>
        obj.error ? failure(obj.error) : success(obj.result)
    )

export const fetchPaymasterResponse = async ({
    request,
    network,
    signal,
}: {
    request: PaymasterRequest
    network: PredefinedNetwork | TestNetwork
    signal?: AbortSignal
}): Promise<unknown> =>
    post(
        '/wallet/rpc/paymaster/',
        {
            query: { network: network.name },
            body: request,
        },
        signal
    ).then((response) =>
        parsePaymasterResponse(response).getSuccessResultOrThrow(
            'Failed to parse paymaster response'
        )
    )
