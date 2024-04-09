import { encodePacked, toBytes } from 'viem'
import Web3 from 'web3'

import { MULTI_SEND_CALL_ONLY_ADDRESS } from '@zeal/domains/Address/constants'
import { ImperativeError } from '@zeal/domains/Error'

import { MetaTransactionData, OperationType } from '../MetaTransactionData'
import { InitialUserOperation } from '../UserOperation'

const EXECUTE_USER_OPERATION_ABI_FRAGMENT = {
    inputs: [
        {
            internalType: 'address',
            name: 'to',
            type: 'address',
        },
        {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
        },
        {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
        },
        {
            internalType: 'uint8',
            name: 'operation',
            type: 'uint8',
        },
    ],
    name: 'executeUserOp',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
}

const MULTI_SEND_CALL_ONLY_ABI_FRAGMENT = {
    inputs: [{ internalType: 'bytes', name: 'transactions', type: 'bytes' }],
    name: 'multiSend',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
}

export const metaTransactionDatasToUserOperationCallData = ({
    metaTransactionDatas,
}: {
    metaTransactionDatas: MetaTransactionData[]
}): InitialUserOperation['callData'] => {
    const web3 = new Web3()

    switch (metaTransactionDatas.length) {
        case 0:
            throw new ImperativeError(
                'Trying to convert empty array of meta transaction datas into user op call data'
            )

        case 1: {
            const metaTransactionData = metaTransactionDatas[0]
            return web3.eth.abi.encodeFunctionCall(
                EXECUTE_USER_OPERATION_ABI_FRAGMENT,
                [
                    metaTransactionData.to,
                    metaTransactionData.value,
                    metaTransactionData.data,
                    metaTransactionData.operation,
                ]
            )
        }

        default: {
            const encodedMultiSendTransactions =
                encodeMultiSendData(metaTransactionDatas)

            const encodedMultiSendCall = web3.eth.abi.encodeFunctionCall(
                MULTI_SEND_CALL_ONLY_ABI_FRAGMENT,
                [encodedMultiSendTransactions]
            )

            return web3.eth.abi.encodeFunctionCall(
                EXECUTE_USER_OPERATION_ABI_FRAGMENT,
                [
                    MULTI_SEND_CALL_ONLY_ADDRESS,
                    '0x0',
                    encodedMultiSendCall,
                    OperationType.DelegateCall,
                ]
            )
        }
    }
}

const encodeMultiSendData = (
    metaTransactionDatas: MetaTransactionData[]
): string => {
    const encodedTransactions = metaTransactionDatas.map((tx) => {
        const data = toBytes(tx.data)
        const packed = encodePacked(
            ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
            [
                tx.operation,
                tx.to,
                BigInt(tx.value),
                BigInt(data.length),
                tx.data,
            ]
        )
        return packed.slice(2)
    })

    return `0x${encodedTransactions.join('')}`
}
