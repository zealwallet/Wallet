import { NetworkHexId } from '@zeal/domains/Network'

export type RPCRequest =
    | DebugTraceTransaction
    | EthAccounts
    | EthBlockNumber
    | EthCall
    | EthChainId
    | EthCoinbase
    | EthEstimateGas
    | EthGasPrice
    | EthGetBalance
    | EthGetBlockByNumber
    | EthGetCode
    | EthGetTransactionByHash
    | EthGetTransactionCount
    | EthGetTransactionReceipt
    | EthLogs
    | EthMaxPriorityFeePerGas
    | EthRequestAccounts
    | EthSendRawTransaction
    | EthSendTransaction
    | EthSignTypedData
    | EthSignTypedDataV3
    | EthSignTypedDataV4
    | NetVersion
    | PersonalECRecover
    | PersonalSign
    | WalletAddEthereumChain
    | WalletSwitchEthereumChain
    | Web3ClientVersion
    | WalletWatchAsset
    | EthGetStorageAt
    | WalletGetSnaps
    | WalletRequestSnaps
    | WalletInvokeSnap
    | NetListening
    | EthNewFilter
    | EthGetFilterChanges
    | EthUninstallFilter
    | MetamaskGetProviderState
    | WalletRequestPermissions
    | WalletGetPermissions

type Common = {
    id: number | string
    jsonrpc: '2.0'
}

export type MetamaskGetProviderState = {
    method: 'metamask_getProviderState'
    params: []
} & Common

export type EthUninstallFilter = {
    method: 'eth_uninstallFilter'
    params: [string] // filterId
} & Common

export type EthGetFilterChanges = {
    method: 'eth_getFilterChanges'
    params: [string] // filterID
} & Common

export type EthNewFilter = {
    method: 'eth_newFilter'
    params: object[] // https://www.quicknode.com/docs/ethereum/eth_newFilter filter param in an object all optional
} & Common

export type NetListening = {
    method: 'net_listening'
    params: []
} & Common

// https://docs.metamask.io/snaps/reference/rpc-api/#wallet_getsnaps
export type WalletGetSnaps = {
    method: 'wallet_getSnaps'
    params: []
} & Common

// https://docs.metamask.io/snaps/reference/rpc-api/#wallet_requestsnaps
export type WalletRequestSnaps = {
    method: 'wallet_requestSnaps'
    params: []
} & Common

// https://docs.metamask.io/snaps/reference/rpc-api/#wallet_invokesnap
export type WalletInvokeSnap = {
    method: 'wallet_invokeSnap'
    params: []
} & Common

export type EthGetStorageAt = {
    method: 'eth_getStorageAt'
    params: [string, string, string] // address, position,blockNumber
} & Common

export type Web3ClientVersion = {
    method: 'web3_clientVersion'
    params: []
} & Common

export type WalletWatchAsset = {
    method: 'wallet_watchAsset'
    params: [] // we don't use watch asset call
} & Common

export type EthGetBalance = {
    method: 'eth_getBalance'
    params: [string, string] // [address, block]
} & Common

export type NetVersion = {
    method: 'net_version'
    params: []
} & Common

export type PersonalECRecover = {
    method: 'personal_ecRecover'
    params: [string, string] // [message, signature]
} & Common

export type PersonalSign = {
    method: 'personal_sign'
    params: [string] // [message]
} & Common

export type EthSignTypedDataV4 = {
    method: 'eth_signTypedData_v4'
    params: [string, string] //  [account, message]
} & Common

export type EthSignTypedDataV3 = {
    method: 'eth_signTypedData_v3'
    params: [string, string] //  [account, message]
} & Common

export type EthSignTypedData = {
    method: 'eth_signTypedData'
    params: [string, string] //  [account, message]
} & Common

export type EthGasPrice = {
    method: 'eth_gasPrice'
    params: unknown[]
} & Common

export type EthGetTransactionCount = {
    method: 'eth_getTransactionCount'
    params: [string, string | undefined] //  [address, block]
} & Common

export type EthGetCode = {
    method: 'eth_getCode'
    params: [string, string | undefined] //  [address, block]
} & Common

export type EthGetBlockByNumber = {
    method: 'eth_getBlockByNumber'
    params: [
        string, // QUANTITY | TAG - integer of a block number, or the string "earliest", "latest" or "pending", as in the default block parameter.
        boolean
    ]
} & Common

export type EthMaxPriorityFeePerGas = {
    method: 'eth_maxPriorityFeePerGas'
    params: []
} & Common

export type WalletSwitchEthereumChain = {
    method: 'wallet_switchEthereumChain'
    params: [
        {
            chainId: NetworkHexId
        }
    ]
} & Common

export type EthSendTransaction = {
    method: 'eth_sendTransaction'
    params: [
        {
            from: string
            data: string
            to?: string
            gas?: string // string or number? Should we parse it??
            gasPrice?: string // string or number? Should we parse it?? !!! :: no we should not ... some trx not support it and we got Error: eip-1559 transactions don't support gasPrice
            maxPriorityFeePerGas?: string
            maxFeePerGas?: string
            value?: string // value + fee = :heart:
            nonce?: string
        }
    ]
} & Common

export type DebugTraceTransaction = {
    method: 'debug_traceTransaction'
    params: [
        string,
        {
            tracer: 'callTracer'
            tracerConfig: {
                enableMemory: boolean
                enableReturnData: boolean
            }
            timeout: string
        }
    ]
} & Common

export type EthAccounts = {
    method: 'eth_accounts'
    params: []
} & Common

export type EthBlockNumber = {
    method: 'eth_blockNumber'
    params: []
} & Common

export type EthCall = {
    method: 'eth_call'
    params: unknown[]
} & Common

export type EthEstimateGas = {
    method: 'eth_estimateGas'
    params: unknown[]
} & Common

export type EthLogs = {
    method: 'eth_getLogs'
    params: []
} & Common

export type EthChainId = {
    method: 'eth_chainId'
    params: []
} & Common

export type EthCoinbase = {
    method: 'eth_coinbase'
    params: []
} & Common

export type EthRequestAccounts = {
    method: 'eth_requestAccounts'
    params: []
} & Common

export type EthSendRawTransaction = {
    method: 'eth_sendRawTransaction'
    params: [string]
} & Common

export type EthGetTransactionReceipt = {
    method: 'eth_getTransactionReceipt'
    params: [string]
} & Common

export type EthGetTransactionByHash = {
    method: 'eth_getTransactionByHash'
    params: [string]
} & Common

export type WalletAddEthereumChain = {
    method: 'wallet_addEthereumChain'
    params: [
        {
            chainId: NetworkHexId
            iconUrls?: string[]
            blockExplorerUrls: string[]
            chainName?: string
            nativeCurrency?: {
                symbol: string
                decimals: number
            }
            rpcUrls: string[]
        }
    ]
} & Common

export type WalletGetPermissions = {
    method: 'wallet_getPermissions'
    params: []
} & Common

export type WalletRequestPermissions = {
    method: 'wallet_requestPermissions'
    params: [
        {
            eth_accounts: Record<string, never>
        }
    ]
} & Common

export type SignMessageRequest =
    | PersonalSign
    | EthSignTypedDataV4
    | EthSignTypedData
    | EthSignTypedDataV3

// Request that requires user interaction
export type InteractionRequest =
    | EthSendTransaction
    | EthRequestAccounts
    | EthSignTypedDataV4
    | EthSignTypedDataV3
    | EthSignTypedData
    | PersonalSign
    | WalletAddEthereumChain
    | WalletRequestPermissions

export * from './RPCErrors'
