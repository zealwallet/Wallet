import Web3 from 'web3'

import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS } from '@zeal/domains/Address/constants'
import { fromBigint } from '@zeal/domains/Address/helpers/fromString'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { ZealWeb3RPCProvider } from '@zeal/domains/RPCRequest/helpers/ZealWeb3RPCProvider'

const PASSKEY_SIGNER_FACTORY_PROXY_ABI = [
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '_hash',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: '_x',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_y',
                type: 'uint256',
            },
        ],
        name: 'getSignerAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const

export const getPredictedPasskeySignerAddress = async ({
    recoveryId,
    publicKeyData,
    network,
    networkRPCMap,
}: {
    recoveryId: string
    publicKeyData: Safe4337['safeDeplymentConfig']['passkeyOwner']['publicKey']
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<Address> => {
    const web3 = new Web3(new ZealWeb3RPCProvider({ network, networkRPCMap }))

    const signerFactoryInterface = new web3.eth.Contract(
        PASSKEY_SIGNER_FACTORY_PROXY_ABI,
        PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS
    )

    const { xCoordinate, yCoordinate } = publicKeyData

    const data = signerFactoryInterface.methods
        .getSignerAddress(recoveryId, xCoordinate, yCoordinate)
        .encodeABI()

    const result = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0' as const,
            method: 'eth_call' as const,
            params: [
                {
                    to: PASSKEY_4337_SIGNER_FACTORY_PROXY_ADDRESS,
                    data,
                },
                'latest',
            ],
        },
    })

    return bigint(result)
        .andThen(fromBigint)
        .getSuccessResultOrThrow(
            'Failed to parse passkey signer predicted address'
        )
}
