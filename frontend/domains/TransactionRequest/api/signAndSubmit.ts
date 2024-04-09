import { generateRandomNumber } from '@zeal/toolkit/Number'
import { object, Result, string } from '@zeal/toolkit/Result'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { signEthSendTransaction } from '@zeal/domains/RPCRequest/helpers/signEthSendTransaction'

import { Simulated, Submited } from '../TransactionRequest'

const parseBlockTimestamp = (input: unknown): Result<unknown, number> =>
    object(input)
        .andThen((obj) => string(obj.timestamp))
        .map((timestamp) => parseInt(timestamp, 16) * 1000)

export const signAndSubmit = async ({
    transactionRequest,
    keyStore,
    sessionPassword,
    networkMap,
    networkRPCMap,
}: {
    transactionRequest: Simulated
    keyStore: SigningKeyStore
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
}): Promise<Submited> => {
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

    const rawTransaction = await signEthSendTransaction({
        sendTransactionRequest: transactionRequest.rpcRequest,
        nonce: transactionRequest.selectedNonce,
        keyStore,
        sessionPassword,
        network,
        networkRPCMap,
        fee: transactionRequest.selectedFee,
        gas: transactionRequest.selectedGas,
    })

    const rpcResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: rawTransaction,
    })

    return string(rpcResponse)
        .map(
            (hash): Submited => ({
                state: 'submited',
                account: transactionRequest.account,
                dApp: transactionRequest.dApp,
                networkHexId: transactionRequest.networkHexId,
                rawTransaction,
                rpcRequest: transactionRequest.rpcRequest,
                simulation: transactionRequest.simulation,
                gasEstimate: transactionRequest.gasEstimate,
                selectedFee: transactionRequest.selectedFee,
                selectedGas: transactionRequest.selectedGas,
                selectedNonce: transactionRequest.selectedNonce,
                submitedTransaction: {
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
