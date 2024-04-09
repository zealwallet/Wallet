import { generateRandomNumber } from '@zeal/toolkit/Number'
import { object, Result, string } from '@zeal/toolkit/Result'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { signEthSendTransaction } from '@zeal/domains/RPCRequest/helpers/signEthSendTransaction'
import { CANCEL_GAS_AMOUNT } from '@zeal/domains/Transactions/constants'

import { CancelSimulated, CancelSubmited } from '../TransactionRequest'

const parseBlockTimestamp = (input: unknown): Result<unknown, number> =>
    object(input)
        .andThen((obj) => string(obj.timestamp))
        .map((timestamp) => parseInt(timestamp, 16) * 1000)

export const cancel = async ({
    transactionRequest,
    keyStore,
    sessionPassword,
    networkMap,
    networkRPCMap,
}: {
    transactionRequest: CancelSimulated
    keyStore: SigningKeyStore
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): Promise<CancelSubmited> => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )
    const currentBlockNumberResponse = await fetchRPCResponse({
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
        },
        network,
        networkRPCMap,
    })

    const currentBlockNumber = string(
        currentBlockNumberResponse
    ).getSuccessResultOrThrow('Failed to parse current block number')

    const currentBlockResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [currentBlockNumber, false],
        },
    })

    const currentBlockTimestamp = parseBlockTimestamp(
        currentBlockResponse
    ).getSuccessResultOrThrow('failed to parse current block')

    const cancelRawTransaction = await signEthSendTransaction({
        sendTransactionRequest: transactionRequest.cancelRPCRequest,
        keyStore,
        nonce: transactionRequest.selectedNonce,
        sessionPassword,
        network: network,
        networkRPCMap,
        fee: transactionRequest.cancelFee,
        gas: CANCEL_GAS_AMOUNT,
    })

    const rpcResponse = await fetchRPCResponse({
        network: network,
        networkRPCMap,
        request: cancelRawTransaction,
    })

    return string(rpcResponse)
        .map(
            (hash): CancelSubmited => ({
                state: 'cancel_submited',
                account: transactionRequest.account,
                dApp: transactionRequest.dApp,
                networkHexId: transactionRequest.networkHexId,
                rawTransaction: transactionRequest.rawTransaction,
                rpcRequest: transactionRequest.rpcRequest,
                simulation: transactionRequest.simulation,
                gasEstimate: transactionRequest.gasEstimate,
                submitedTransaction: transactionRequest.submitedTransaction,

                selectedFee: transactionRequest.selectedFee,
                selectedGas: transactionRequest.selectedGas,
                selectedNonce: transactionRequest.selectedNonce,

                cancelFee: transactionRequest.cancelFee,
                cancelRPCRequest: transactionRequest.cancelRPCRequest,
                cancelRawTransaction: cancelRawTransaction,
                cancelSubmitedTransaction: {
                    state: 'queued',
                    hash,
                    submittedNonce: transactionRequest.selectedNonce,
                    queuedAt: currentBlockTimestamp,
                },
            })
        )
        .getSuccessResultOrThrow(
            'failed to parse RPC response for sendRawTransaction'
        )
}
