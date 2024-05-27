import { Address } from '@zeal/domains/Address'
import { CryptoCurrency } from '@zeal/domains/Currency'

export type Network = PredefinedNetwork | CustomNetwork | TestNetwork

export type PredefinedNetwork = {
    type: 'predefined'
    name:
        | 'Ethereum'
        | 'Arbitrum'
        | 'zkSync'
        | 'BSC'
        | 'Polygon'
        | 'PolygonZkevm'
        | 'Linea'
        | 'Fantom'
        | 'Optimism'
        | 'Base'
        | 'Blast'
        | 'OPBNB'
        | 'Gnosis'
        | 'Celo'
        | 'Avalanche'
        | 'Cronos'
        | 'Aurora'

    gasTokenAddress: Address
    hexChainId: NetworkHexId
    blockExplorerUrl: string
    isSimulationSupported: boolean
    isZealRPCSupported: boolean
    isSafeSupported: boolean
    trxType: 'legacy' | 'eip1559'
}

export type TestNetwork = {
    type: 'testnet'
    name:
        | 'EthereumGoerli'
        | 'EthereumSepolia'
        | 'PolygonMumbai'
        | 'BscTestnet'
        | 'AvalancheFuji'
        | 'OptimismGoerli'
        | 'FantomTestnet'
        | 'ArbitrumGoerli'
        | 'AuroraTestnet'

    nativeCurrency: CryptoCurrency
    hexChainId: NetworkHexId
    blockExplorerUrl: string
    isSimulationSupported: boolean
    isZealRPCSupported: boolean
    isSafeSupported: boolean
    trxType: 'legacy' | 'eip1559'
}

export type CustomNetwork = {
    type: 'custom'
    name: string
    nativeCurrency: CryptoCurrency
    hexChainId: NetworkHexId
    blockExplorerUrl: string | null
    defaultRpcUrl: string // https link
    rpcUrl: string // https link

    isSimulationSupported: false
    isZealRPCSupported: false
    isSafeSupported: false
    trxType: 'legacy' | 'eip1559'
}

export type NetworkHexId = string & { _opaque: typeof NetworkHexIdSymbol }
declare const NetworkHexIdSymbol: unique symbol

export type NetworkMap = Record<NetworkHexId, Network>
export type CustomNetworkMap = Record<NetworkHexId, CustomNetwork>

export type CurrentNetwork =
    | { type: 'all_networks' }
    | { type: 'specific_network'; network: Network }

export type NetworkRPCMap = Record<NetworkHexId, NetworkRPC>

export type NetworkRPC = {
    current: { type: 'default' } | { type: 'custom'; url: string }
    available: string[]
}
