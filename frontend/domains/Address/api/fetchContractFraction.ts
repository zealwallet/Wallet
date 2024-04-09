import Web3 from 'web3'

import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint, string } from '@zeal/toolkit/Result'

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
        name: 'decimals',
        outputs: [
            {
                name: 'decimals' as const,
                type: 'uint8' as const,
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
] as const

export const fetchContractFraction = async ({
    contract,
    network,
    networkRPCMap,
}: Params): Promise<number> => {
    const web3 = new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap }))
    const contractEncoded = new web3.eth.Contract(ABI, contract)
    const data: string = contractEncoded.methods.decimals().encodeABI()

    const decimalStr = await fetchRPCResponse({
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

    const parsed = string(decimalStr)
        .map((str) => web3.eth.abi.decodeParameter('int8', str))
        .andThen(bigint)
        .map(Number)
        .getSuccessResultOrThrow('Failed to parse contract decimal')

    return parsed
}
