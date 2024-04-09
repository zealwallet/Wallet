import Web3 from 'web3'

import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthCall } from '@zeal/domains/RPCRequest'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

const ENTRYPOINT_GET_NONCE_ABI = {
    inputs: [
        { internalType: 'address', name: 'sender', type: 'address' },
        {
            internalType: 'uint192',
            name: 'key',
            type: 'uint192',
        },
    ],
    name: 'getNonce',
    outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
}

export const fetchCurrentEntrypointNonce = async ({
    entrypoint,
    address,
    network,
    networkRPCMap,
    signal,
}: {
    entrypoint: Address
    address: Address
    network: Network
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}): Promise<bigint> => {
    const request: EthCall = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
            {
                to: entrypoint,
                data: new Web3().eth.abi.encodeFunctionCall(
                    ENTRYPOINT_GET_NONCE_ABI,
                    [address, '0x0']
                ),
            },
            'latest',
        ],
    }

    const response = await fetchRPCResponse({
        network,
        networkRPCMap,
        request,
        signal,
    })

    return bigint(response).getSuccessResultOrThrow(
        'Failed to parse current entrypoint nonce of sender'
    )
}
