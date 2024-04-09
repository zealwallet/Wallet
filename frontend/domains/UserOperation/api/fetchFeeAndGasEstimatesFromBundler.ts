import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint, object, Result, shape } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { fetchBundlerResponse } from '@zeal/domains/UserOperation/api/fetchBundlerResponse'

import { BundlerGasEstimate, BundlerGasPrice } from '../GasEstimate'
import { InitialUserOperation } from '../UserOperation'

export type FeeAndGasEstimates = {
    gasEstimate: BundlerGasEstimate
    gasPrice: BundlerGasPrice
}

const parse = (input: unknown): Result<unknown, FeeAndGasEstimates> =>
    object(input).andThen((obj) =>
        shape({
            gasEstimate: shape({
                preVerificationGas: bigint(obj.preVerificationGas),
                callGasLimit: bigint(obj.callGasLimit),
                verificationGasLimit: bigint(obj.verificationGasLimit),
            }),
            gasPrice: shape({
                maxFeePerGas: bigint(obj.maxFeePerGas),
                maxPriorityFeePerGas: bigint(obj.maxPriorityFeePerGas),
            }),
        })
    )

export const fetchFeeAndGasEstimatesFromBundler = async ({
    network,
    initialUserOperation,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    network: Network
    dummySignature: string
}): Promise<FeeAndGasEstimates> => {
    // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            const gasEstimateResponse = await fetchBundlerResponse({
                request: {
                    id: generateRandomNumber(),
                    jsonrpc: '2.0',
                    method: 'eth_estimateUserOperationGas',
                    params: [
                        {
                            sender: initialUserOperation.sender,
                            callData: initialUserOperation.callData,
                            nonce: bigIntToHex(initialUserOperation.nonce),
                            initCode: initialUserOperation.initCode || '0x',
                            paymasterAndData: '0x',
                            signature: dummySignature,
                        },
                        initialUserOperation.entrypoint,
                    ],
                },
                network,
            })

            return parse(gasEstimateResponse).getSuccessResultOrThrow(
                'Failed to parse gas estimate response'
            )
        }
        case 'custom':
            throw new ImperativeError('Custom network not supported')
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
