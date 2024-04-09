import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network } from '@zeal/domains/Network'
import { UserOperationWithSignature } from '@zeal/domains/UserOperation'
import {
    EthSendUserOperation,
    fetchBundlerResponse,
} from '@zeal/domains/UserOperation/api/fetchBundlerResponse'

export const submitUserOperationToBundler = async ({
    userOperationWithSignature,
    network,
    signal,
}: {
    userOperationWithSignature: UserOperationWithSignature
    network: Network
    signal?: AbortSignal
}): Promise<string> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            const request: EthSendUserOperation = {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_sendUserOperation',
                params: [
                    {
                        sender: userOperationWithSignature.sender,
                        callData: userOperationWithSignature.callData,
                        initCode: userOperationWithSignature.initCode || '0x',
                        nonce: bigIntToHex(userOperationWithSignature.nonce),
                        maxFeePerGas: bigIntToHex(
                            userOperationWithSignature.maxFeePerGas
                        ),
                        maxPriorityFeePerGas: bigIntToHex(
                            userOperationWithSignature.maxPriorityFeePerGas
                        ),
                        callGasLimit: bigIntToHex(
                            userOperationWithSignature.callGasLimit
                        ),
                        verificationGasLimit: bigIntToHex(
                            userOperationWithSignature.verificationGasLimit
                        ),
                        preVerificationGas: bigIntToHex(
                            userOperationWithSignature.preVerificationGas
                        ),
                        paymasterAndData:
                            userOperationWithSignature.paymasterAndData || '0x',
                        signature: userOperationWithSignature.signature,
                    },
                    userOperationWithSignature.entrypoint,
                ],
            }

            const response = await fetchBundlerResponse({
                request,
                network,
                signal,
            })

            return string(response).getSuccessResultOrThrow(
                'Failed to parse user operation hash'
            )
        }
        case 'custom':
            throw new ImperativeError(
                'Cannot submit user operation on custom network'
            ) // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
