import Web3 from 'web3'

import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'

type Params = {
    contract: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}

const ABI = [
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: 'symbol' as const,
                type: 'string' as const,
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
] as const

export const fetchContractSymbol = async ({
    contract,
    network,
    networkRPCMap,
}: Params): Promise<string> => {
    const web3 = new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap }))

    const contractEncoded = new web3.eth.Contract(ABI, contract)
    const data: string = contractEncoded.methods.symbol().encodeABI()

    const symbolStr = await fetchRPCResponse({
        network: network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_call' as const,
            params: [
                {
                    to: contract,
                    data,
                },
                'latest',
            ],
        },
    })

    const parsed = string(symbolStr)
        .map((str) => web3.eth.abi.decodeParameter('string', str))
        .andThen(string)
        .getSuccessResultOrThrow('Failed to parse contract symbol')

    return parsed
}
