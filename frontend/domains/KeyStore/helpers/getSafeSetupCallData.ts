import { encodeFunctionData } from 'viem'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import {
    NULL_ADDRESS,
    SAFE_4337_DEPLOYMENT_ROUTER_ADDRESS,
} from '@zeal/domains/Address/constants'

import { Safe4337 } from '..'

const SAFE_DEPLOYMENT_ROUTER_ABI = [
    {
        inputs: [
            {
                name: '_hash',
                type: 'bytes32',
                internalType: 'bytes32',
            },
            {
                name: '_x',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '_y',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        name: 'setupSafe',
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'nonpayable' as const,
        type: 'function' as const,
    },
] as const

const SAFE_MASTER_COPY_ABI = [
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_owners',
                type: 'address[]',
            },
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'address',
                name: 'fallbackHandler',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'paymentToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'payment',
                type: 'uint256',
            },
            {
                internalType: 'address payable',
                name: 'paymentReceiver',
                type: 'address',
            },
        ],
        name: 'setup',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const

type Params = {
    safeDeplymentConfig: Safe4337['safeDeplymentConfig']
}

export const getSafeSetupCallData = ({
    safeDeplymentConfig,
}: Params): Hexadecimal.Hexadecimal => {
    const fallbackHandlerAddress = NULL_ADDRESS as Hexadecimal.Hexadecimal
    const paymentToken = NULL_ADDRESS as Hexadecimal.Hexadecimal
    const paymentReceiver = NULL_ADDRESS as Hexadecimal.Hexadecimal
    const payment = 0

    const data = encodeFunctionData({
        abi: SAFE_DEPLOYMENT_ROUTER_ABI,
        functionName: 'setupSafe',
        args: [
            safeDeplymentConfig.passkeyOwner.recoveryId,
            BigInt(safeDeplymentConfig.passkeyOwner.publicKey.xCoordinate),
            BigInt(safeDeplymentConfig.passkeyOwner.publicKey.yCoordinate),
        ],
    })

    const signerAddress = safeDeplymentConfig.passkeyOwner
        .signerAddress as Hexadecimal.Hexadecimal

    return encodeFunctionData({
        abi: SAFE_MASTER_COPY_ABI,
        functionName: 'setup',
        args: [
            [signerAddress],
            BigInt(safeDeplymentConfig.threshold),
            SAFE_4337_DEPLOYMENT_ROUTER_ADDRESS as Hexadecimal.Hexadecimal,
            data,
            fallbackHandlerAddress,
            paymentToken,
            BigInt(payment),
            paymentReceiver,
        ],
    })
}
