import { namehash, normalize } from 'viem/ens'
import Web3 from 'web3'

import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { NULL_ADDRESS } from '@zeal/domains/Address/constants'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { ImperativeError } from '@zeal/domains/Error'
import { NetworkRPCMap } from '@zeal/domains/Network'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

const ENS_REGISTRY_ABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'resolver',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
] as const

const ENS_RESOLVER_ABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32',
            },
        ],
        name: 'addr',
        outputs: [
            {
                internalType: 'address payable',
                name: '',
                type: 'address',
            },
        ],
        payable: false,
        stateMutability: 'view' as const,
        type: 'function' as const,
    },
] as const

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

const END_REGEXP =
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}(?:\.[a-z]{2,})?$/gim

export const fetchENS = async ({
    domain,
    networkRPCMap,
}: {
    domain: string
    networkRPCMap: NetworkRPCMap
}): Promise<Address> => {
    if (!domain.match(END_REGEXP)) {
        throw new ImperativeError(`Wrong domain input`)
    }

    const web3 = new Web3()

    const contract = new web3.eth.Contract(ENS_REGISTRY_ABI, ENS_REGISTRY)
    const name = namehash(normalize(domain))
    const ethNetwork = PREDEFINED_NETWORKS.find(
        (network) => network.name === 'Ethereum'
    )
    if (!ethNetwork) {
        throw new ImperativeError('cannot find constant')
    }

    const resolverResponse = await fetchRPCResponse({
        network: ethNetwork,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: ENS_REGISTRY,
                    data: contract.methods.resolver(name).encodeABI(),
                },
                'latest',
            ],
        },
    })

    const resolverAddress = string(resolverResponse)
        .andThen((str) =>
            parseAddress(web3.eth.abi.decodeParameter('address', str))
        )
        .getSuccessResultOrThrow('Failed to parse resolver address')

    if (resolverAddress === NULL_ADDRESS) {
        throw new ImperativeError('Unable to find resolver for this ENS')
    }

    const resolverContract = new web3.eth.Contract(
        ENS_RESOLVER_ABI,
        resolverAddress
    )

    const addressResponse = await fetchRPCResponse({
        network: ethNetwork,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: resolverAddress,
                    data: resolverContract.methods.addr(name).encodeABI(),
                },
                'latest',
            ],
        },
    })

    const address = string(addressResponse)
        .map((str) => web3.eth.abi.decodeParameter('address', str))
        .andThen(parseAddress)
        .getSuccessResultOrThrow('Failed to parse ENS address')

    if (address === NULL_ADDRESS) {
        throw new ImperativeError('Unable to resolve this ENS')
    }

    return address
}
