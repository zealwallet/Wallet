import Web3 from 'web3'

import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { SAFE_4337_MODULE_ADDRESS } from '@zeal/domains/Address/constants'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

import {
    UserOperationHash,
    UserOperationWithoutSignature,
} from '../UserOperation'

const TEN_MINUTES_IN_SEC = 10 * 60
const ONE_MINUTE_IN_SEC = 60

const GET_OPERATION_HASH_ABI_FRAGMENT = {
    inputs: [
        {
            components: [
                {
                    internalType: 'address',
                    name: 'sender',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'nonce',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'initCode',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'callData',
                    type: 'bytes',
                },
                {
                    internalType: 'uint256',
                    name: 'callGasLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'verificationGasLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'preVerificationGas',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'maxFeePerGas',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'maxPriorityFeePerGas',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'paymasterAndData',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'signature',
                    type: 'bytes',
                },
            ],
            internalType: 'struct UserOperation',
            name: 'userOp',
            type: 'tuple',
        },
    ],
    name: 'getOperationHash',
    outputs: [
        {
            internalType: 'bytes32',
            name: 'operationHash',
            type: 'bytes32',
        },
    ],
    stateMutability: 'view',
    type: 'function',
}

export const fetchUserOperationHash = async ({
    userOperation,
    network,
    signal,
    networkRPCMap,
}: {
    userOperation: UserOperationWithoutSignature
    network: Network
    signal?: AbortSignal
    networkRPCMap: NetworkRPCMap
}): Promise<UserOperationHash> => {
    const web3 = new Web3()

    const validFrom = Math.round(Date.now() / 1000 - ONE_MINUTE_IN_SEC) // user operation gets rejected if it's too close to the current time
    const validUntil = validFrom + TEN_MINUTES_IN_SEC

    const encodedValidFrom = web3.eth.abi
        .encodeParameter('uint48', validFrom)
        .slice(-12) // web3js adds padded 0s to the left, we only want the last 12 bytes

    const encodedValidUntil = web3.eth.abi
        .encodeParameter('uint48', validUntil)
        .slice(-12) // web3js adds padded 0s to the left, we only want the last 12 bytes

    const encodedEmptySignature = `0x${encodedValidFrom}${encodedValidUntil}`

    const hashResponse = await fetchRPCResponse({
        network,
        signal,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: SAFE_4337_MODULE_ADDRESS,
                    data: web3.eth.abi.encodeFunctionCall(
                        GET_OPERATION_HASH_ABI_FRAGMENT,
                        [
                            {
                                sender: userOperation.sender,
                                callData: userOperation.callData,
                                nonce: bigIntToHex(userOperation.nonce),
                                initCode: userOperation.initCode || '0x',
                                maxFeePerGas: bigIntToHex(
                                    userOperation.maxFeePerGas
                                ),
                                maxPriorityFeePerGas: bigIntToHex(
                                    userOperation.maxPriorityFeePerGas
                                ),
                                callGasLimit: bigIntToHex(
                                    userOperation.callGasLimit
                                ),
                                verificationGasLimit: bigIntToHex(
                                    userOperation.verificationGasLimit
                                ),
                                preVerificationGas: bigIntToHex(
                                    userOperation.preVerificationGas
                                ),
                                paymasterAndData:
                                    userOperation.paymasterAndData || '0x',
                                signature: encodedEmptySignature,
                            },
                        ]
                    ),
                },
                'latest',
            ],
        },
    })

    const hash = string(hashResponse).getSuccessResultOrThrow(
        'Failed to parse user operation hash response'
    )

    return {
        type: 'user_operation_hash',
        hash,
        encodedValidFrom: `0x${encodedValidFrom}`,
        encodedValidUntil: `0x${encodedValidUntil}`,
    }
}
