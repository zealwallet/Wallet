import { decodeFunctionResult, encodeFunctionData } from 'viem'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { combine, string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

const SAFE_ABI = [
    {
        inputs: [],
        name: 'getOwners',
        outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const

export const fetchSafeOwners = async ({
    safeAddress,
    network,
    networkRPCMap,
}: {
    safeAddress: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<Address[]> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: safeAddress,
                    data: encodeFunctionData({
                        abi: SAFE_ABI,
                        functionName: 'getOwners',
                    }),
                },
                'latest',
            ],
        },
    })
        .then((data) =>
            string(data)
                .andThen(Hexadecimal.parseFromString)
                .getSuccessResultOrThrow('failed to parse fetchOwners response')
        )
        .then((data) =>
            decodeFunctionResult({
                abi: SAFE_ABI,
                data,
                functionName: 'getOwners',
            })
        )
        .then((data) =>
            combine(data.map(parseAddress)).getSuccessResultOrThrow(
                'failed to parse owners'
            )
        )
