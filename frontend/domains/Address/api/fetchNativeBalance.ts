import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

type Params = {
    address: Address
    network: Network
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}

export const fetchNativeBalance = async ({
    address,
    network,
    networkRPCMap,
    signal,
}: Params): Promise<bigint> => {
    const response = await fetchRPCResponse({
        network: network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_getBalance' as const,
            params: [address, 'latest'],
        },
        signal,
    })

    return bigint(response).getSuccessResultOrThrow(
        'Failed to fetch native balance'
    )
}
