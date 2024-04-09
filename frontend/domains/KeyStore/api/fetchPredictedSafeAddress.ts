import {
    decodeFunctionResult,
    encodeFunctionData,
    encodePacked,
    getContractAddress,
    keccak256,
    pad,
} from 'viem'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import {
    SAFE_4337_MASTER_COPY_ADDRESS,
    SAFE_4337_PROXY_FACTORY_ADDRESS,
} from '@zeal/domains/Address/constants'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { Safe4337 as SafeKeyStore } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

import { getSafeSetupCallData } from '../helpers/getSafeSetupCallData'

const SAFE_PROXY_FACTORY_ABI = [
    {
        inputs: [],
        name: 'proxyCreationCode',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
] as const

export const fetchPredictedSafeAddress = async ({
    safeDeplymentConfig,
    network,
    networkRPCMap,
}: {
    networkRPCMap: NetworkRPCMap
    network: Network
    safeDeplymentConfig: SafeKeyStore['safeDeplymentConfig']
}): Promise<Address> => {
    const setupData = getSafeSetupCallData({
        safeDeplymentConfig,
    })

    const encodedSaltNonce = encodePacked(
        ['uint256'],
        [BigInt(safeDeplymentConfig.saltNonce)]
    )

    const setupDataHash = keccak256(setupData)

    const salt = keccak256(Hexadecimal.concat(setupDataHash, encodedSaltNonce))

    const constructorData = pad(
        encodePacked(
            ['address'],
            [SAFE_4337_MASTER_COPY_ADDRESS as Hexadecimal.Hexadecimal]
        )
    )

    const from = SAFE_4337_PROXY_FACTORY_ADDRESS as Hexadecimal.Hexadecimal

    const proxyFactoryCreationCode = await fetchRPCResponse({
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: SAFE_4337_PROXY_FACTORY_ADDRESS,
                    data: encodeFunctionData({
                        abi: SAFE_PROXY_FACTORY_ABI,
                        functionName: 'proxyCreationCode',
                    }),
                },
                'latest',
            ],
        },
        network,
        networkRPCMap,
    })
        .then((data) =>
            string(data)
                .andThen(Hexadecimal.parseFromString)
                .getSuccessResultOrThrow(
                    'failed to parse factory creation code'
                )
        )
        .then((data) =>
            decodeFunctionResult({ abi: SAFE_PROXY_FACTORY_ABI, data })
        )
        .then((data) =>
            string(data)
                .andThen(Hexadecimal.parseFromString)
                .getSuccessResultOrThrow(
                    'failed to parse decoded factory creation code'
                )
        )

    const initCode = Hexadecimal.concat(
        proxyFactoryCreationCode,
        constructorData
    )

    return fromString(
        getContractAddress({
            salt,
            from,
            opcode: 'CREATE2',
            bytecode: initCode,
        })
    ).getSuccessResultOrThrow(
        'Failed to parse address after CREATE2 prediction'
    )
}
