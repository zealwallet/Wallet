import Web3 from 'web3'

import { bigIntToHex } from '@zeal/toolkit/BigInt'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    BundlerGasEstimate,
    BundlerGasPrice,
    InitialUserOperation,
    MetaTransactionData,
} from '@zeal/domains/UserOperation'
import { fetchFeeAndGasEstimatesFromBundler } from '@zeal/domains/UserOperation/api/fetchFeeAndGasEstimatesFromBundler'
import {
    APPROVAL_CALL_GAS_LIMIT_BUFFER,
    DUMMY_SPONSOR_PAYMASTER_AND_DATA,
    DUMMY_TOKEN_PAYMASTER_AND_DATA,
    SPONSOR_PAYMASTER_VERIFICATION_GAS_LIMIT_BUFFER,
    TOKEN_PAYMASTER_VERIFICATION_GAS_LIMIT_BUFFER,
} from '@zeal/domains/UserOperation/constants'
import { ethSendTransactionToMetaTransactionData } from '@zeal/domains/UserOperation/helpers/ethSendTransactionToMetaTransactionData'
import { metaTransactionDatasToUserOperationCallData } from '@zeal/domains/UserOperation/helpers/metaTransactionDatasToUserOperationCallData'

import { calculatePreVerificationGas } from './calculatePreVerificationGas'

const ERC20_APPROVE_ABI = {
    constant: false,
    inputs: [
        {
            name: '_spender',
            type: 'address',
        },
        {
            name: '_value',
            type: 'uint256',
        },
    ],
    name: 'approve',
    outputs: [
        {
            name: '',
            type: 'bool',
        },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
}

const PAYMASTER_VERIFICATION_GAS_LIMIT_MULTIPLIER = 3n
const BUNDLER_PRE_VERIFICATION_GAS_BUFFER = 0.1
const PRECISION = 1000000
const MINIMUM_CALL_GAS_LIMIT = 25_000n // This is roughly the gas needed for a native transfer. The callGasLimit should never be lower than this.

type TotalGasEstimate = BundlerGasEstimate & { totalGas: bigint }

type GasCalculationResponse = {
    gasPrice: BundlerGasPrice
    nonPaymasterGasEstimate: TotalGasEstimate
    tokenPaymasterWithoutApprovalGasEstimate: TotalGasEstimate
    tokenPaymasterWithApprovalGasEstimate: TotalGasEstimate
    sponsorPaymasterWithApprovalGasEstimate: TotalGasEstimate
}

const getDummyApprovalMetaTransactionData = (): MetaTransactionData => {
    const request: EthSendTransaction = {
        id: generateRandomNumber(),
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [
            {
                from: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                to: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                data: new Web3().eth.abi.encodeFunctionCall(ERC20_APPROVE_ABI, [
                    '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
                    bigIntToHex(5000000000000000000n),
                ]),
                value: '0x0',
            },
        ],
    }

    return ethSendTransactionToMetaTransactionData(request)
}

const calculateTotalGas = ({
    gasEstimate,
}: {
    gasEstimate: BundlerGasEstimate
}): bigint =>
    gasEstimate.callGasLimit +
    gasEstimate.verificationGasLimit +
    gasEstimate.preVerificationGas

const bufferPreVerificationGas = (
    preVerificationGas: bigint,
    totalGas: bigint
): bigint =>
    preVerificationGas +
    (totalGas * BigInt(BUNDLER_PRE_VERIFICATION_GAS_BUFFER * PRECISION)) /
        BigInt(PRECISION)

export const calculateGasEstimates = async ({
    network,
    initialUserOperation,
    metaTransactionDatas,
    verificationGasLimitBuffer,
    networkRPCMap,
    dummySignature,
}: {
    initialUserOperation: InitialUserOperation
    metaTransactionDatas: MetaTransactionData[]
    network: Network
    networkRPCMap: NetworkRPCMap
    verificationGasLimitBuffer: bigint
    dummySignature: string
}): Promise<GasCalculationResponse> => {
    const bundlerResponse = await fetchFeeAndGasEstimatesFromBundler({
        dummySignature,
        initialUserOperation,
        network,
    })

    const adjustedCallGasLimit =
        bundlerResponse.gasEstimate.callGasLimit < MINIMUM_CALL_GAS_LIMIT
            ? MINIMUM_CALL_GAS_LIMIT
            : bundlerResponse.gasEstimate.callGasLimit

    const sigBufferedVerificationGasLimit =
        bundlerResponse.gasEstimate.verificationGasLimit +
        verificationGasLimitBuffer

    const nonPaymasterPreVerificationGas = await calculatePreVerificationGas({
        network,
        networkRPCMap,
        initialUserOperation,
        dummySignature,
        paymasterAndData: null,
        feeAndGasEstimates: {
            gasPrice: bundlerResponse.gasPrice,
            gasEstimate: {
                preVerificationGas:
                    bundlerResponse.gasEstimate.preVerificationGas,
                verificationGasLimit: sigBufferedVerificationGasLimit,
                callGasLimit: adjustedCallGasLimit,
            },
        },
    })

    // No paymaster calculations (native payment)

    const nonPaymasterTotalGas = calculateTotalGas({
        gasEstimate: {
            callGasLimit: adjustedCallGasLimit,
            verificationGasLimit: sigBufferedVerificationGasLimit,
            preVerificationGas: nonPaymasterPreVerificationGas,
        },
    })

    const nonPaymasterGasEstimate: TotalGasEstimate = {
        callGasLimit: adjustedCallGasLimit,
        verificationGasLimit: sigBufferedVerificationGasLimit,
        preVerificationGas: bufferPreVerificationGas(
            nonPaymasterPreVerificationGas,
            nonPaymasterTotalGas
        ),
        totalGas: nonPaymasterTotalGas,
    }

    // Token Paymaster calculations (ERC20 payments)

    const tokenPaymasterVerificationGasLimit =
        sigBufferedVerificationGasLimit +
        TOKEN_PAYMASTER_VERIFICATION_GAS_LIMIT_BUFFER

    // Paymaster without approval calculations

    const paymasterWithoutApprovalPreVerificationGas =
        await calculatePreVerificationGas({
            network,
            networkRPCMap,
            initialUserOperation,
            dummySignature,
            paymasterAndData: DUMMY_TOKEN_PAYMASTER_AND_DATA,
            feeAndGasEstimates: {
                gasPrice: bundlerResponse.gasPrice,
                gasEstimate: {
                    callGasLimit: adjustedCallGasLimit,
                    verificationGasLimit: tokenPaymasterVerificationGasLimit,
                    preVerificationGas:
                        bundlerResponse.gasEstimate.preVerificationGas,
                },
            },
        })

    const paymasterWithoutApprovalTotalGas = calculateTotalGas({
        gasEstimate: {
            callGasLimit: adjustedCallGasLimit,
            verificationGasLimit:
                tokenPaymasterVerificationGasLimit *
                PAYMASTER_VERIFICATION_GAS_LIMIT_MULTIPLIER,
            preVerificationGas: paymasterWithoutApprovalPreVerificationGas,
        },
    })

    const paymasterWithoutApprovalGasEstimate: TotalGasEstimate = {
        callGasLimit: adjustedCallGasLimit,
        verificationGasLimit: tokenPaymasterVerificationGasLimit,
        preVerificationGas: bufferPreVerificationGas(
            paymasterWithoutApprovalPreVerificationGas,
            paymasterWithoutApprovalTotalGas
        ),
        totalGas: paymasterWithoutApprovalTotalGas,
    }

    // Paymaster with approval calculations

    const approvalBufferedCallGasLimit =
        adjustedCallGasLimit + APPROVAL_CALL_GAS_LIMIT_BUFFER

    const updatedCallDataWithApproval =
        metaTransactionDatasToUserOperationCallData({
            metaTransactionDatas: [
                ...metaTransactionDatas,
                getDummyApprovalMetaTransactionData(),
            ],
        })

    const paymasterWitApprovalPreVerificationGas =
        await calculatePreVerificationGas({
            network,
            networkRPCMap,
            initialUserOperation: {
                ...initialUserOperation,
                callData: updatedCallDataWithApproval,
            },
            dummySignature,
            paymasterAndData: DUMMY_TOKEN_PAYMASTER_AND_DATA,
            feeAndGasEstimates: {
                gasPrice: bundlerResponse.gasPrice,
                gasEstimate: {
                    callGasLimit: approvalBufferedCallGasLimit,
                    verificationGasLimit: tokenPaymasterVerificationGasLimit,
                    preVerificationGas:
                        bundlerResponse.gasEstimate.preVerificationGas,
                },
            },
        })

    const paymasterWithApprovalTotalGas = calculateTotalGas({
        gasEstimate: {
            callGasLimit: approvalBufferedCallGasLimit,
            verificationGasLimit:
                tokenPaymasterVerificationGasLimit *
                PAYMASTER_VERIFICATION_GAS_LIMIT_MULTIPLIER,
            preVerificationGas: paymasterWitApprovalPreVerificationGas,
        },
    })

    const paymasterWithApprovalGasEstimate: TotalGasEstimate = {
        callGasLimit: approvalBufferedCallGasLimit,
        verificationGasLimit: tokenPaymasterVerificationGasLimit,
        preVerificationGas: bufferPreVerificationGas(
            paymasterWitApprovalPreVerificationGas,
            paymasterWithApprovalTotalGas
        ),
        totalGas: paymasterWithApprovalTotalGas,
    }

    // Sponsor Paymaster calculations

    const sponsorPaymasterVerificationGasLimit =
        sigBufferedVerificationGasLimit +
        SPONSOR_PAYMASTER_VERIFICATION_GAS_LIMIT_BUFFER

    const sponsorPaymasterPreVerificationGas =
        await calculatePreVerificationGas({
            network,
            networkRPCMap,
            initialUserOperation,
            dummySignature,
            paymasterAndData: DUMMY_SPONSOR_PAYMASTER_AND_DATA,
            feeAndGasEstimates: {
                gasPrice: bundlerResponse.gasPrice,
                gasEstimate: {
                    callGasLimit: adjustedCallGasLimit,
                    verificationGasLimit: sponsorPaymasterVerificationGasLimit,
                    preVerificationGas:
                        bundlerResponse.gasEstimate.preVerificationGas,
                },
            },
        })

    const sponsorPaymasterTotalGas = calculateTotalGas({
        gasEstimate: {
            callGasLimit: adjustedCallGasLimit,
            verificationGasLimit:
                sponsorPaymasterVerificationGasLimit *
                PAYMASTER_VERIFICATION_GAS_LIMIT_MULTIPLIER,
            preVerificationGas: sponsorPaymasterPreVerificationGas,
        },
    })

    const sponsorPaymasterWithApprovalGasEstimate: TotalGasEstimate = {
        callGasLimit: adjustedCallGasLimit,
        verificationGasLimit: sponsorPaymasterVerificationGasLimit,
        preVerificationGas: bufferPreVerificationGas(
            sponsorPaymasterPreVerificationGas,
            paymasterWithoutApprovalTotalGas
        ),
        totalGas: sponsorPaymasterTotalGas,
    }

    return {
        gasPrice: bundlerResponse.gasPrice,
        nonPaymasterGasEstimate,
        tokenPaymasterWithoutApprovalGasEstimate:
            paymasterWithoutApprovalGasEstimate,
        tokenPaymasterWithApprovalGasEstimate: paymasterWithApprovalGasEstimate,
        sponsorPaymasterWithApprovalGasEstimate,
    }
}
