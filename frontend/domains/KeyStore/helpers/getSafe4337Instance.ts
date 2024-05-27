import { decodeFunctionResult, encodeFunctionData } from 'viem'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { SAFE_4337_MODULE_ENTRYPOINT_ADDRESS } from '@zeal/domains/Address/constants'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { Safe4337 as SafeKeyStore } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

import { getSafeDeploymentInitCode } from './getSafeDeploymentInitCode'

import { fetchPredictedSafeAddress } from '../api/fetchPredictedSafeAddress'
import { fetchSafeOwners } from '../api/fetchSafeOwners'

const SAFE_ABI = [
    {
        inputs: [],
        name: 'getOwners',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'SUPPORTED_ENTRYPOINT',
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

export type SafeInstance =
    | {
          type: 'deployed'
          safeAddress: Address
          owners: Address[]
          entrypoint: Address
      }
    | {
          type: 'not_deployed'
          safeAddress: Address
          deploymentInitCode: string
          entrypoint: Address
      }

export const getSafe4337Instance = async ({
    safeDeplymentConfig,
    network,
    networkRPCMap,
}: {
    safeDeplymentConfig: SafeKeyStore['safeDeplymentConfig']
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<SafeInstance> => {
    const safeAddress = await fetchPredictedSafeAddress({
        safeDeplymentConfig,
        network,
        networkRPCMap,
    })

    const isSafeDeployed = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [safeAddress, 'latest'],
        },
    })
        .then((code) =>
            string(code).getSuccessResultOrThrow(
                'failed to parse eth_getCode result when checking if safe is deployed'
            )
        )
        .then((code) => code !== '0x')

    if (isSafeDeployed) {
        const [entrypointAddress, owners] = await Promise.all([
            fetchEntrypointAddress({
                network,
                networkRPCMap,
                safeAddress,
            }),
            fetchSafeOwners({
                network,
                networkRPCMap,
                safeAddress,
            }),
        ])

        return {
            type: 'deployed',
            safeAddress,
            owners,
            entrypoint: entrypointAddress,
        }
    } else {
        const deploymentInitCode = getSafeDeploymentInitCode({
            safeDeplymentConfig,
        })

        return {
            type: 'not_deployed',
            safeAddress,
            deploymentInitCode,

            entrypoint: SAFE_4337_MODULE_ENTRYPOINT_ADDRESS,
        }
    }
}

const fetchEntrypointAddress = async ({
    safeAddress,
    network,
    networkRPCMap,
}: {
    safeAddress: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<Address> =>
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
                        functionName: 'SUPPORTED_ENTRYPOINT',
                    }),
                },
                'latest',
            ],
        },
    })
        .then((data) =>
            string(data)
                .andThen(Hexadecimal.parseFromString)
                .getSuccessResultOrThrow(
                    'failed to parse fetchEntrypointAddress response'
                )
        )
        .then((data) =>
            decodeFunctionResult({
                abi: SAFE_ABI,
                data,
                functionName: 'SUPPORTED_ENTRYPOINT',
            })
        )
        .then((data) =>
            fromString(data).getSuccessResultOrThrow(
                'failed to parse entrypoint address'
            )
        )
