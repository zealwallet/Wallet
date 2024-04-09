import { generateRandomNumber } from '@zeal/toolkit/Number'
import { object, Result, string } from '@zeal/toolkit/Result'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

const parseBlockTimestamp = (input: unknown): Result<unknown, number> =>
    object(input)
        .andThen((obj) => string(obj.timestamp))
        .map((timestamp) => parseInt(timestamp, 16) * 1000)

export const fetchBlockTimestamp = async ({
    network,
    networkRPCMap,
    blockNumber,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    blockNumber: string
}): Promise<number> => {
    const blockResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, false],
        },
    })

    return parseBlockTimestamp(blockResponse).getSuccessResultOrThrow(
        'failed to parse eth_getBlockByNumber'
    )
}
