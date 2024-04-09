import { encodeFunctionData } from 'viem'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import {
    SAFE_4337_MASTER_COPY_ADDRESS,
    SAFE_4337_PROXY_FACTORY_ADDRESS,
} from '@zeal/domains/Address/constants'
import { Safe4337 } from '@zeal/domains/KeyStore'

import { getSafeSetupCallData } from './getSafeSetupCallData'

const SAFE_PROXY_FACTORY_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_singleton',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'initializer',
                type: 'bytes',
            },
            {
                internalType: 'uint256',
                name: 'saltNonce',
                type: 'uint256',
            },
        ],
        name: 'createProxyWithNonce',
        outputs: [
            {
                internalType: 'contract SafeProxy',
                name: 'proxy',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const

type Params = {
    safeDeplymentConfig: Safe4337['safeDeplymentConfig']
}

export const getSafeDeploymentInitCode = ({
    safeDeplymentConfig,
}: Params): Hexadecimal.Hexadecimal => {
    const setupData = getSafeSetupCallData({
        safeDeplymentConfig,
    })

    const to = SAFE_4337_PROXY_FACTORY_ADDRESS as Hexadecimal.Hexadecimal

    const data = encodeFunctionData({
        abi: SAFE_PROXY_FACTORY_ABI,
        functionName: 'createProxyWithNonce',
        args: [
            SAFE_4337_MASTER_COPY_ADDRESS as Hexadecimal.Hexadecimal,
            setupData,
            BigInt(safeDeplymentConfig.saltNonce),
        ],
    })

    return Hexadecimal.concat(to, data)
}
