import Web3 from 'web3'

import { notReachable } from '@zeal/toolkit'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import { bigint, object, string } from '@zeal/toolkit/Result'

import {
    ARBITRUM_NODE_INTERFACE_ADDRESS,
    OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
} from '@zeal/domains/Address/constants'
import { ImperativeError } from '@zeal/domains/Error'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { InitialUserOperation } from '@zeal/domains/UserOperation'
import { FeeAndGasEstimates } from '@zeal/domains/UserOperation/api/fetchFeeAndGasEstimatesFromBundler'

const OPTIMISM_GET_L1_FEE_ABI_FRAGMENT = {
    inputs: [
        {
            internalType: 'bytes',
            name: '_data',
            type: 'bytes',
        },
    ],
    name: 'getL1Fee',
    outputs: [
        {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
        },
    ],
    stateMutability: 'view',
    type: 'function',
}

const HANDLE_OPS_ABI_FRAGMENT = {
    inputs: [
        {
            components: [
                {
                    internalType: 'address',
                    name: 'sender',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'nonce',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'initCode',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'callData',
                    type: 'bytes',
                },
                {
                    internalType: 'uint256',
                    name: 'callGasLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'verificationGasLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'preVerificationGas',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'maxFeePerGas',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'maxPriorityFeePerGas',
                    type: 'uint256',
                },
                {
                    internalType: 'bytes',
                    name: 'paymasterAndData',
                    type: 'bytes',
                },
                {
                    internalType: 'bytes',
                    name: 'signature',
                    type: 'bytes',
                },
            ],
            internalType: 'struct UserOperation[]',
            name: 'ops',
            type: 'tuple[]',
        },
        {
            internalType: 'address payable',
            name: 'beneficiary',
            type: 'address',
        },
    ],
    name: 'handleOps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
}

const ARBITRUM_L1_GAS_ESTIMATE_ABI_FRAGMENT = {
    inputs: [
        {
            internalType: 'address',
            name: 'to',
            type: 'address',
        },
        {
            internalType: 'bool',
            name: 'contractCreation',
            type: 'bool',
        },
        {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
        },
    ],
    name: 'gasEstimateL1Component',
    outputs: [
        {
            internalType: 'uint64',
            name: 'gasEstimateForL1',
            type: 'uint64',
        },
        {
            internalType: 'uint256',
            name: 'baseFee',
            type: 'uint256',
        },
        {
            internalType: 'uint256',
            name: 'l1BaseFeeEstimate',
            type: 'uint256',
        },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
}

const BUNDLE_SIZE = 1
const ZERO_BYTE_GAS_OVERHEAD = 4
const NON_ZERO_BYTE_GAS_OVERHEAD = 16
const FIXED_GAS_OVERHEAD = 21000
const PER_USER_OP_GAS_OVERHEAD = 18300
const PER_USER_OP_WORD_GAS_OVERHEAD = 4

const packUserOperation = ({
    initialUserOperation,
    feeAndGasEstimates,
    paymasterAndData,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    paymasterAndData: string | null
    dummySignature: string
}): Uint8Array => {
    const web3 = new Web3()
    const packed = new Web3().eth.abi.encodeParameters(
        [
            'address', // sender
            'uint256', // nonce
            'bytes', // initCode
            'bytes', // callData
            'uint256', // callGasLimit
            'uint256', // verificationGasLimit
            'uint256', // preVerificationGas
            'uint256', // maxFeePerGas
            'uint256', // maxPriorityFeePerGas
            'bytes', // paymasterAndData
            'bytes', // signature
        ],
        [
            initialUserOperation.sender,
            initialUserOperation.nonce,
            initialUserOperation.initCode || '0x',
            initialUserOperation.callData,
            feeAndGasEstimates.gasEstimate.callGasLimit,
            feeAndGasEstimates.gasEstimate.verificationGasLimit,
            feeAndGasEstimates.gasEstimate.preVerificationGas,
            feeAndGasEstimates.gasPrice.maxFeePerGas,
            feeAndGasEstimates.gasPrice.maxPriorityFeePerGas,
            paymasterAndData || '0x',
            dummySignature,
        ]
    )

    return web3.utils.hexToBytes(packed)
}

const calculateGenericPreVerificationGas = ({
    initialUserOperation,
    feeAndGasEstimates,
    paymasterAndData,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    paymasterAndData: string | null
    dummySignature: string
}): bigint => {
    const packedUserOperation = packUserOperation({
        initialUserOperation,
        feeAndGasEstimates,
        paymasterAndData,
        dummySignature,
    })
    const callDataCost = packedUserOperation
        .map((x: number) =>
            x === 0 ? ZERO_BYTE_GAS_OVERHEAD : NON_ZERO_BYTE_GAS_OVERHEAD
        )
        .reduce((sum, x) => sum + x)

    return BigInt(
        Math.round(
            callDataCost +
                FIXED_GAS_OVERHEAD / BUNDLE_SIZE +
                PER_USER_OP_GAS_OVERHEAD +
                PER_USER_OP_WORD_GAS_OVERHEAD * packedUserOperation.length
        )
    )
}

const calculateArbitrumPreVerificationGas = async ({
    initialUserOperation,
    feeAndGasEstimates,
    paymasterAndData,
    network,
    networkRPCMap,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    network: Network
    networkRPCMap: NetworkRPCMap
    paymasterAndData: string | null
    dummySignature: string
}): Promise<bigint> => {
    const web3 = new Web3()

    const preVerificationGas = calculateGenericPreVerificationGas({
        initialUserOperation,
        feeAndGasEstimates,
        paymasterAndData,
        dummySignature,
    })

    const handleOpsData = web3.eth.abi.encodeFunctionCall(
        HANDLE_OPS_ABI_FRAGMENT,
        [
            [
                {
                    sender: initialUserOperation.sender,
                    nonce: initialUserOperation.nonce,
                    initCode: initialUserOperation.initCode || '0x',
                    callData: initialUserOperation.callData,
                    callGasLimit: feeAndGasEstimates.gasEstimate.callGasLimit,
                    verificationGasLimit:
                        feeAndGasEstimates.gasEstimate.verificationGasLimit,
                    preVerificationGas:
                        feeAndGasEstimates.gasEstimate.preVerificationGas,
                    maxFeePerGas: feeAndGasEstimates.gasPrice.maxFeePerGas,
                    maxPriorityFeePerGas:
                        feeAndGasEstimates.gasPrice.maxPriorityFeePerGas,
                    paymasterAndData: paymasterAndData || '0x',
                    signature: dummySignature,
                },
            ],
            initialUserOperation.sender,
        ]
    )

    const response = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [
                {
                    to: ARBITRUM_NODE_INTERFACE_ADDRESS,
                    data: web3.eth.abi.encodeFunctionCall(
                        ARBITRUM_L1_GAS_ESTIMATE_ABI_FRAGMENT,
                        [initialUserOperation.entrypoint, false, handleOpsData]
                    ),
                },
                'latest',
            ],
        },
    })

    const decodedResponse = web3.eth.abi.decodeParameters(
        ['uint64', 'uint256', 'uint256'],
        string(response).getSuccessResultOrThrow(
            'gasEstimateL1Component did not return valid string'
        )
    )

    const l1GasEstimate = object(decodedResponse)
        .andThen((obj) => bigint(obj[0]))
        .getSuccessResultOrThrow(
            'Failed to parse Arbitrum L1 gas estimate response'
        )

    return preVerificationGas + l1GasEstimate
}

const calculateOptimismPreVerificationGas = async ({
    network,
    networkRPCMap,
    initialUserOperation,
    feeAndGasEstimates,
    paymasterAndData,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    network: Network
    networkRPCMap: NetworkRPCMap
    paymasterAndData: string | null
    dummySignature: string
}): Promise<bigint> => {
    const web3 = new Web3()

    const preVerificationGas = calculateGenericPreVerificationGas({
        initialUserOperation,
        feeAndGasEstimates,
        paymasterAndData,
        dummySignature,
    })

    const handleOpsData = web3.eth.abi.encodeFunctionCall(
        HANDLE_OPS_ABI_FRAGMENT,
        [
            [
                {
                    sender: initialUserOperation.sender,
                    nonce: initialUserOperation.nonce,
                    initCode: initialUserOperation.initCode || '0x',
                    callData: initialUserOperation.callData,
                    callGasLimit: feeAndGasEstimates.gasEstimate.callGasLimit,
                    verificationGasLimit:
                        feeAndGasEstimates.gasEstimate.verificationGasLimit,
                    preVerificationGas:
                        feeAndGasEstimates.gasEstimate.preVerificationGas,
                    maxFeePerGas: feeAndGasEstimates.gasPrice.maxFeePerGas,
                    maxPriorityFeePerGas:
                        feeAndGasEstimates.gasPrice.maxPriorityFeePerGas,
                    paymasterAndData: paymasterAndData || '0x',
                    signature: dummySignature,
                },
            ],
            initialUserOperation.sender,
        ]
    )

    const [blockResponse, l1FeeResponse] = await Promise.all([
        fetchRPCResponse({
            network,
            networkRPCMap,
            request: {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: ['latest', false],
            },
        }),
        fetchRPCResponse({
            network,
            networkRPCMap,
            request: {
                id: generateRandomNumber(),
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [
                    {
                        to: OP_STACK_GAS_PRICE_ORACLE_ADDRESS,
                        data: web3.eth.abi.encodeFunctionCall(
                            OPTIMISM_GET_L1_FEE_ABI_FRAGMENT,
                            [handleOpsData]
                        ),
                    },
                    'latest',
                ],
            },
        }),
    ])

    const baseFeePerGas = object(blockResponse)
        .andThen((obj) => bigint(obj.baseFeePerGas))
        .getSuccessResultOrThrow('Failed to parse OP baseFeePerGas')

    const l1Fee = string(l1FeeResponse)
        .andThen((str) => bigint(str))
        .getSuccessResultOrThrow('Failed to parse Optimism L1 fee response')

    const l2MaxFee = feeAndGasEstimates.gasPrice.maxFeePerGas
    const l2PriorityFee =
        baseFeePerGas + feeAndGasEstimates.gasPrice.maxPriorityFeePerGas
    const l2Price = l2MaxFee < l2PriorityFee ? l2MaxFee : l2PriorityFee

    return preVerificationGas + l1Fee / l2Price
}

export const calculatePreVerificationGas = async ({
    network,
    networkRPCMap,
    initialUserOperation,
    feeAndGasEstimates,
    paymasterAndData,
    dummySignature,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    initialUserOperation: InitialUserOperation
    feeAndGasEstimates: FeeAndGasEstimates
    paymasterAndData: string | null
    dummySignature: string
}): Promise<bigint> => {
    // TODO :: @Nicvaniek create narrowed network type for chains that support gas abstraction
    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            if (!network.isSafeSupported) {
                throw new ImperativeError(
                    'Network not supported for Smart Wallet gas calculations',
                    { network }
                )
            }

            switch (network.name) {
                case 'Arbitrum':
                case 'ArbitrumGoerli':
                    return calculateArbitrumPreVerificationGas({
                        feeAndGasEstimates,
                        paymasterAndData,
                        dummySignature,
                        initialUserOperation,
                        networkRPCMap,
                        network,
                    })
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Base':
                case 'OPBNB':
                case 'Blast':
                    return calculateOptimismPreVerificationGas({
                        feeAndGasEstimates,
                        paymasterAndData,
                        dummySignature,
                        initialUserOperation,
                        networkRPCMap,
                        network,
                    })
                case 'Ethereum':
                case 'zkSync':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Linea':
                case 'Fantom':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Cronos':
                case 'Aurora':
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'PolygonMumbai':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'FantomTestnet':
                case 'AuroraTestnet':
                    return calculateGenericPreVerificationGas({
                        initialUserOperation,
                        feeAndGasEstimates,
                        paymasterAndData,
                        dummySignature,
                    })
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        }
        case 'custom':
            throw new ImperativeError('Custom network not supported')
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
