import {
    EthExecutionAPI,
    JsonRpcResponseWithResult,
    Web3APIPayload,
} from 'web3'

import { notReachable } from '@zeal/toolkit'
import { UnexpectedResultFailureError } from '@zeal/toolkit/Result'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { parseRPCRequest } from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'

export class ZealWeb3RPCProvider {
    constructor({
        network,
        networkRPCMap,
    }: {
        networkRPCMap: NetworkRPCMap
        network: Network
    }) {
        this.networkRPCMap = networkRPCMap
        this.network = network
    }

    host: string = ''
    networkRPCMap: NetworkRPCMap
    network: Network

    connected: boolean = false

    supportsSubscriptions = (): false => false

    async request<Method extends string, ResultType = unknown>(
        payload: Web3APIPayload<EthExecutionAPI, Method>
    ): Promise<JsonRpcResponseWithResult<ResultType>> {
        const request = parseRPCRequest(payload).getSuccessResultOrThrow(
            'Faield to parse RPC request in web3 provider'
        )

        switch (request.method) {
            case 'eth_chainId':
                return {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc || '2.0',
                    result: this.network.hexChainId as ResultType,
                }

            case 'debug_traceTransaction':
            case 'eth_accounts':
            case 'eth_blockNumber':
            case 'eth_call':
            case 'eth_coinbase':
            case 'eth_estimateGas':
            case 'eth_gasPrice':
            case 'eth_getBalance':
            case 'eth_getBlockByNumber':
            case 'eth_getCode':
            case 'eth_getTransactionByHash':
            case 'eth_getTransactionCount':
            case 'eth_getTransactionReceipt':
            case 'eth_getLogs':
            case 'eth_maxPriorityFeePerGas':
            case 'eth_requestAccounts':
            case 'eth_sendRawTransaction':
            case 'eth_sendTransaction':
            case 'eth_signTypedData':
            case 'eth_signTypedData_v3':
            case 'eth_signTypedData_v4':
            case 'net_version':
            case 'personal_ecRecover':
            case 'personal_sign':
            case 'wallet_addEthereumChain':
            case 'wallet_switchEthereumChain':
            case 'web3_clientVersion':
            case 'wallet_watchAsset':
            case 'eth_getStorageAt':
            case 'wallet_getSnaps':
            case 'wallet_requestSnaps':
            case 'wallet_invokeSnap':
            case 'net_listening':
            case 'eth_newFilter':
            case 'eth_getFilterChanges':
            case 'eth_uninstallFilter':
            case 'metamask_getProviderState':
            case 'wallet_requestPermissions':
            case 'wallet_getPermissions':
                return fetchRPCResponse({
                    network: this.network,
                    networkRPCMap: this.networkRPCMap,
                    request,
                })
                    .then((response) => {
                        return {
                            id: payload.id,
                            jsonrpc: payload.jsonrpc || '2.0',
                            result: response as ResultType,
                        }
                    })
                    .catch((error) => {
                        if (error instanceof UnexpectedResultFailureError) {
                            // We patch the error message to include the response data, so it will match output of web3js
                            error.reason.message =
                                error.reason.message +
                                `return data: ${error.reason.data}`
                            throw error.reason
                        } else {
                            throw error
                        }
                    })
                break

            default:
                return notReachable(request)
        }
    }
}
