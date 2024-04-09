import { notReachable } from '@zeal/toolkit'
import { keys } from '@zeal/toolkit/Object'
import {
    array,
    arrayOf,
    boolean,
    combine,
    failure,
    match,
    notDefined,
    number,
    object,
    oneOf,
    parseHttpsUrl,
    Result,
    safeArrayOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { NetworkHexId } from '@zeal/domains/Network'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    DebugTraceTransaction,
    EthAccounts,
    EthBlockNumber,
    EthCall,
    EthChainId,
    EthCoinbase,
    EthEstimateGas,
    EthGasPrice,
    EthGetBalance,
    EthGetBlockByNumber,
    EthGetCode,
    EthGetFilterChanges,
    EthGetStorageAt,
    EthGetTransactionByHash,
    EthGetTransactionCount,
    EthGetTransactionReceipt,
    EthLogs,
    EthMaxPriorityFeePerGas,
    EthNewFilter,
    EthRequestAccounts,
    EthSendRawTransaction,
    EthSendTransaction,
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    EthUninstallFilter,
    MetamaskGetProviderState,
    NetListening,
    NetVersion,
    PersonalECRecover,
    PersonalSign,
    RPCRequest,
    WalletAddEthereumChain,
    WalletGetPermissions,
    WalletGetSnaps,
    WalletInvokeSnap,
    WalletRequestPermissions,
    WalletRequestSnaps,
    WalletSwitchEthereumChain,
    WalletWatchAsset,
    Web3ClientVersion,
} from '@zeal/domains/RPCRequest'

// Helpers
const parseChainId = (
    params: unknown
): Result<unknown, [{ chainId: NetworkHexId }]> =>
    array(params)
        .andThen(([param]) => object(param))
        .andThen((param) =>
            shape({
                chainId: parseNetworkHexId(param.chainId),
            })
        )
        .map((param): [{ chainId: NetworkHexId }] => [param])

const parseSingleStringParam = (params: unknown): Result<unknown, [string]> =>
    array(params)
        .andThen(([param]) => string(param))
        .map((s): [string] => [s])

// Main methods

export const parseRPCRequest = (
    input: unknown
): Result<unknown, RPCRequest> => {
    const r: RPCRequest = {
        method: 'eth_blockNumber',
    } as EthBlockNumber as any

    // to make sure we are adding parser to array when extending main type
    switch (r.method) {
        case 'eth_accounts':
        case 'eth_sendRawTransaction':
        case 'eth_sendTransaction':
        case 'eth_requestAccounts':
        case 'eth_chainId':
        case 'eth_coinbase':
        case 'eth_blockNumber':
        case 'eth_call':
        case 'eth_estimateGas':
        case 'eth_getLogs':
        case 'eth_maxPriorityFeePerGas':
        case 'eth_getTransactionReceipt':
        case 'eth_getTransactionByHash':
        case 'wallet_switchEthereumChain':
        case 'wallet_addEthereumChain':
        case 'debug_traceTransaction':
        case 'personal_sign':
        case 'eth_gasPrice':
        case 'eth_getBlockByNumber':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData':
        case 'eth_getTransactionCount':
        case 'eth_getCode':
        case 'net_version':
        case 'eth_getBalance':
        case 'personal_ecRecover':
        case 'eth_signTypedData_v3':
        case 'web3_clientVersion':
        case 'wallet_watchAsset':
        case 'eth_getStorageAt':
        case 'wallet_getSnaps':
        case 'wallet_requestSnaps':
        case 'wallet_invokeSnap':
        case 'net_listening':
        case 'eth_getFilterChanges':
        case 'eth_newFilter':
        case 'eth_uninstallFilter':
        case 'metamask_getProviderState':
        case 'wallet_requestPermissions':
        case 'wallet_getPermissions':
            break
        /* istanbul ignore next */
        default:
            return notReachable(r)
    }

    return object(input).andThen((obj) =>
        oneOf(obj, [
            oneOf(obj, [
                parseEthAccounts(obj),
                parseEthBlockNumber(obj),
                parseEthCall(obj),
                parseEthChainId(obj),
                parseEthEstimateGas(obj),
                parseEthGetTransactionReceipt(obj),
                parseEthLogs(obj),
                parseEthRequestAccounts(obj),
                parseEthSendRawTransaction(obj),
                parseEthSendTransaction(obj),
            ]),
            oneOf(obj, [
                parseDebugTranceTransaction(obj),
                parseEthGasPrice(obj),
                parseEthGetBlockByNumber(obj),
                parseEthGetTransactionByHash(obj),
                parseEthGetTransactionCount(obj),
                parseEthSignTypedDataV4(obj),
                parsePersonalECRecover(obj),
                parsePersonalSign(obj),
                parseWalletAddEthereumChain(obj),
                parseWalletSwitchEthereumChain(obj),
            ]),
            oneOf(obj, [
                parseEthGetBalance(obj),
                parseEthGetCode(obj),
                parseNetVersion(obj),
                parseEthSignTypedData(obj),
                parseEthSignTypedDataV3(obj),
                parseWeb3ClientVersion(obj),
                parseWalletWatchAsset(obj),
                parseEthGetStorageAt(obj),
                parseEthCoinbase(obj),
            ]),
            oneOf(obj, [
                parseWalletGetSnaps(obj),
                parseWalletRequestSnaps(obj),
                parseWalletInvokeSnap(obj),
                parseNetListening(obj),
                parseEthGetFilterChanges(obj),
                parseEthNewFilter(obj),
                parseUnInstallFilter(obj),
                parseMetamaskGetProviderState(obj),
                parseWalletRequestPermissions(obj),
                parseWalletGetPermissions(obj),
            ]),
            parseEthMaxPriorityFeePerGas(obj),
        ])
    )
}

const parseId = (id: unknown) => oneOf(id, [number(id), string(id)])

export const parseMetamaskGetProviderState = (
    obj: Record<string, unknown>
): Result<unknown, MetamaskGetProviderState> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'metamask_getProviderState' as const),
        params: success([] as []),
    })

export const parseUnInstallFilter = (
    obj: Record<string, unknown>
): Result<unknown, EthUninstallFilter> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_uninstallFilter' as const),
        params: arrayOf(obj.params, string).map(
            ([filterId]) => [filterId] as [string]
        ),
    })

export const parseEthNewFilter = (
    obj: Record<string, unknown>
): Result<unknown, EthNewFilter> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_newFilter'),
        params: arrayOf(obj.params, object),
    })

export const parseEthGetFilterChanges = (
    obj: Record<string, unknown>
): Result<unknown, EthGetFilterChanges> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getFilterChanges' as const),
        params: arrayOf(obj.params, string).map(
            ([filterId]) => [filterId] as [string]
        ),
    })

export const parseNetListening = (
    obj: Record<string, unknown>
): Result<unknown, NetListening> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'net_listening' as const),
        params: success([] as []),
    })

export const parseWalletGetSnaps = (
    obj: Record<string, unknown>
): Result<unknown, WalletGetSnaps> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_getSnaps' as const),
        params: success([] as []),
    })

export const parseWalletRequestSnaps = (
    obj: Record<string, unknown>
): Result<unknown, WalletRequestSnaps> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_requestSnaps' as const),
        params: success([] as []),
    })

export const parseWalletInvokeSnap = (
    obj: Record<string, unknown>
): Result<unknown, WalletInvokeSnap> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: oneOf(obj, [
            match(obj.method, 'wallet_invokeSnap' as const),
            match(obj.method, 'wallet_snap').map(
                () => 'wallet_invokeSnap' as const
            ),
        ]),
        params: success([] as []),
    })

export const parseEthGetStorageAt = (
    obj: Record<string, unknown>
): Result<unknown, EthGetStorageAt> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getStorageAt' as const),
        params: array(obj.params)
            .andThen(([address, position, block]) =>
                shape({
                    address: string(address),
                    position: string(position),
                    block: string(block),
                })
            )
            .map(({ address, position, block }): [string, string, string] => [
                address,
                position,
                block,
            ]),
    })

export const parseWalletWatchAsset = (
    obj: Record<string, unknown>
): Result<unknown, WalletWatchAsset> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_watchAsset' as const),
        params: success([] as []),
    })

export const parseWeb3ClientVersion = (
    obj: Record<string, unknown>
): Result<unknown, Web3ClientVersion> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'web3_clientVersion' as const),
        params: success([] as []),
    })

export const parseEthGetBalance = (
    obj: Record<string, unknown>
): Result<unknown, EthGetBalance> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getBalance' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: string(block),
                })
            )
            .map(({ address, block }): [string, string] => [address, block]),
    })

export const parseNetVersion = (
    obj: Record<string, unknown>
): Result<unknown, NetVersion> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'net_version' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionCount = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionCount> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionCount' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: oneOf(block, [string(block), notDefined(block)]),
                })
            )
            .map(({ address, block }): [string, string | undefined] => [
                address,
                block,
            ]),
    })

export const parseEthGetCode = (
    obj: Record<string, unknown>
): Result<unknown, EthGetCode> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getCode' as const),
        params: array(obj.params)
            .andThen(([address, block]) =>
                shape({
                    address: string(address),
                    block: oneOf(block, [string(block), notDefined(block)]),
                })
            )
            .map(({ address, block }): [string, string | undefined] => [
                address,
                block,
            ]),
    })

export const parseWalletAddEthereumChain = (
    obj: Record<string, unknown>
): Result<unknown, WalletAddEthereumChain> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_addEthereumChain' as const),
        params: array(obj.params).andThen(([data]) =>
            object(data)
                .andThen((requestData) =>
                    shape({
                        chainId: parseNetworkHexId(requestData.chainId),
                        iconUrls: oneOf(requestData, [
                            arrayOf(requestData.iconUrls, string),
                            notDefined(requestData.iconUrls),
                        ]),
                        blockExplorerUrls: oneOf(requestData, [
                            safeArrayOf(
                                requestData.blockExplorerUrls,
                                (input: unknown) =>
                                    string(input).andThen(parseHttpsUrl)
                            ),
                            // If blockExplorerUrls is malformed, we accept it as empty anyway
                            success([] as []),
                        ]),
                        chainName: oneOf(requestData, [
                            string(requestData.chainName),
                            notDefined(requestData.chainName),
                        ]),
                        nativeCurrency: oneOf(requestData, [
                            object(requestData.nativeCurrency).andThen((o) =>
                                shape({
                                    symbol: string(o.symbol),
                                    decimals: number(o.decimals),
                                })
                            ),
                            // if nativeCurrency is malformed, we accept it as undefined
                            success(undefined),
                        ]),
                        rpcUrls: oneOf(requestData, [
                            safeArrayOf(requestData.rpcUrls, (input: unknown) =>
                                string(input).andThen(parseHttpsUrl)
                            ),
                            // If rpcUrls is malformed, we accept it as empty array
                            success([] as []),
                        ]),
                    })
                )
                .map((data): [WalletAddEthereumChain['params'][0]] => [data])
        ),
    })

export const parsePersonalSign = (
    obj: Record<string, unknown>
): Result<unknown, PersonalSign> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'personal_sign' as const),
        params: array(obj.params).andThen(([message, account]) =>
            oneOf(obj.params, [
                // expected order; test this first
                parseAddress(account).andThen(() =>
                    string(message).map((message): [string] => [message])
                ),
                // inverted order
                parseAddress(message).andThen(() =>
                    string(account).map((message): [string] => [message])
                ),
                // none is an address
                string(message).map((message): [string] => [message]),
            ])
        ),
    })

export const parsePersonalECRecover = (
    obj: Record<string, unknown>
): Result<unknown, PersonalECRecover> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'personal_ecRecover' as const),
        params: array(obj.params)
            .andThen(([message, signature]) =>
                combine([string(message), string(signature)])
            )
            .map(([message, signature]): [string, string] => [
                message,
                signature,
            ]),
    })

export const parseEthSignTypedDataV4 = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedDataV4> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData_v4' as const),
        params: array(obj.params)
            .andThen(([message, account]) =>
                combine([string(message), string(account)])
            )
            .map(([message, account]): [string, string] => [message, account]),
    })

export const parseEthSignTypedDataV3 = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedDataV3> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData_v3' as const),
        params: array(obj.params)
            .andThen(([message, account]) =>
                combine([string(message), string(account)])
            )
            .map(([message, account]): [string, string] => [message, account]),
    })

export const parseEthSignTypedData = (
    obj: Record<string, unknown>
): Result<unknown, EthSignTypedData> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_signTypedData' as const),
        params: array(obj.params).andThen(([message, account]) =>
            shape({
                message: oneOf(message, [
                    string(message),
                    array(message).map(JSON.stringify),
                ]),
                account: string(account),
            }).map((params): [string, string] => [
                params.account,
                params.message,
            ])
        ),
    })

export const parseDebugTranceTransaction = (
    obj: Record<string, unknown>
): Result<unknown, DebugTraceTransaction> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'debug_traceTransaction' as const),
        params: array(obj.params).andThen(([trx, debugConfig]) =>
            shape({
                trx: string(trx),
                debugConfig: object(debugConfig).andThen((dto) =>
                    shape({
                        tracer: match(dto.tracer, 'callTracer' as const),
                        timeout: string(dto.timeout),
                        tracerConfig: object(dto.tracerConfig).andThen(
                            (tracerConfig) =>
                                shape({
                                    enableMemory: boolean(
                                        tracerConfig.enableMemory
                                    ),
                                    enableReturnData: boolean(
                                        tracerConfig.enableReturnData
                                    ),
                                })
                        ),
                    })
                ),
            }).map(({ trx, debugConfig }): DebugTraceTransaction['params'] => [
                trx,
                debugConfig,
            ])
        ),
    })

export const parseWalletSwitchEthereumChain = (
    obj: Record<string, unknown>
): Result<unknown, WalletSwitchEthereumChain> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_switchEthereumChain' as const),
        params: parseChainId(obj.params),
    })

export const parseEthLogs = (
    obj: Record<string, unknown>
): Result<unknown, EthLogs> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getLogs' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionReceipt = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionReceipt> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionReceipt' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthEstimateGas = (
    obj: Record<string, unknown>
): Result<unknown, EthEstimateGas> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_estimateGas' as const),
        params: array(obj.params),
    })

export const parseEthSendTransaction = (
    obj: Record<string, unknown>
): Result<unknown, EthSendTransaction> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_sendTransaction' as const),
        param: array(obj.params)
            .map((arr) => arr[0])
            .andThen((param) => object(param))
            .andThen((param) =>
                shape({
                    from: string(param.from),
                    data: oneOf(param.data, [string(param.data), success('')]),
                    to: oneOf(param.to, [
                        string(param.to),
                        notDefined(param.to),
                    ]),
                    gas: oneOf(param.gas, [
                        string(param.gas),
                        notDefined(param.gas),
                    ]),
                    value: oneOf(param.value, [
                        string(param.value),
                        notDefined(param.value),
                    ]),
                    nonce: oneOf(param.nonce, [
                        string(param.nonce),
                        notDefined(param.nonce),
                    ]),
                })
            ),
    }).map(({ jsonrpc, id, method, param }) => ({
        id,
        jsonrpc,
        method,
        params: [param],
    }))

export const parseEthSendRawTransaction = (
    obj: Record<string, unknown>
): Result<unknown, EthSendRawTransaction> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_sendRawTransaction' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthRequestAccounts = (
    obj: Record<string, unknown>
): Result<unknown, EthRequestAccounts> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_requestAccounts' as const),
        params: success([] as []),
    })

export const parseEthChainId = (
    obj: Record<string, unknown>
): Result<unknown, EthChainId> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_chainId' as const),
        params: success([] as []),
    })

export const parseEthCoinbase = (
    obj: Record<string, unknown>
): Result<unknown, EthCoinbase> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_coinbase' as const),
        params: success([] as []),
    })

export const parseEthAccounts = (
    obj: Record<string, unknown>
): Result<unknown, EthAccounts> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_accounts' as const),
        params: success([] as []),
    })

export const parseEthCall = (
    obj: Record<string, unknown>
): Result<unknown, EthCall> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_call' as const),
        params: array(obj.params),
    })

export const parseEthBlockNumber = (
    obj: Record<string, unknown>
): Result<unknown, EthBlockNumber> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_blockNumber' as const),
        params: success([] as []),
    })

export const parseEthGetTransactionByHash = (
    obj: Record<string, unknown>
): Result<unknown, EthGetTransactionByHash> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getTransactionByHash' as const),
        params: parseSingleStringParam(obj.params),
    })

export const parseEthGasPrice = (
    obj: Record<string, unknown>
): Result<unknown, EthGasPrice> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_gasPrice' as const),
        params: oneOf(obj.params, [array(obj.params), success([])]),
    })

export const parseEthGetBlockByNumber = (
    obj: Record<string, unknown>
): Result<unknown, EthGetBlockByNumber> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_getBlockByNumber' as const),
        params: array(obj.params)
            .andThen(([quantityOrTag, isFullTransaction]) =>
                shape({
                    quantityOrTag: string(quantityOrTag),
                    isFullTransaction: boolean(isFullTransaction),
                })
            )
            .map(({ quantityOrTag, isFullTransaction }): [string, boolean] => [
                quantityOrTag,
                isFullTransaction,
            ]),
    })

export const parseEthMaxPriorityFeePerGas = (
    obj: Record<string, unknown>
): Result<unknown, EthMaxPriorityFeePerGas> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'eth_maxPriorityFeePerGas' as const),
        params: success([] as []),
    })

export const parseWalletGetPermissions = (
    obj: Record<string, unknown>
): Result<unknown, WalletGetPermissions> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_getPermissions' as const),
        params: success([] as []),
    })

// This is documented here: https://eips.ethereum.org/EIPS/eip-2255, and can be fairly arbitrary data
// But we are restricting the parser to see (in Sentry) what is out there and maybe deal with this differently
// TODO: Part of the parser code is replicated in parseSelectMetaMaskProvider and needs to be updated if we decide to change here.
export const parseWalletRequestPermissions = (
    obj: Record<string, unknown>
): Result<unknown, WalletRequestPermissions> =>
    shape({
        id: parseId(obj.id),
        jsonrpc: success('2.0' as const),
        method: match(obj.method, 'wallet_requestPermissions' as const),
        params: array(obj.params).andThen((params) => {
            if (params.length !== 1) {
                return failure({ type: 'unexpected_request_permissions' })
            }

            return object(params[0]).andThen((obj) => {
                if (keys(obj).length !== 1) {
                    return failure({ type: 'unexpected_request_permissions' })
                }

                return object(obj.eth_accounts).andThen((empty) => {
                    if (keys(empty).length !== 0) {
                        return failure({
                            type: 'unexpected_request_permissions',
                        })
                    }

                    return success([
                        {
                            eth_accounts: {} as Record<string, never>,
                        },
                    ] as [
                        {
                            eth_accounts: Record<string, never>
                        }
                    ])
                })
            })
        }),
    })
