import { NetworkHexId } from '@zeal/domains/Network'

export type ChainIdNetwork = {
    chainId: NetworkHexId
    name: string
    rpcUrls: string[]
    nativeCurrency: {
        symbol: string
        decimals: number
    }
    blockExplorerUrls: string[]
}
