import { notReachable } from '@zeal/toolkit'

import { Network } from '@zeal/domains/Network'

export const isEditNetworkFeeEnabled = (network: Network): boolean => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'BSC':
                case 'BscTestnet':
                case 'Polygon':
                case 'PolygonMumbai':
                case 'PolygonZkevm':
                case 'Linea':
                case 'Fantom':
                case 'FantomTestnet':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'AvalancheFuji':
                case 'Cronos':
                    return true
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Arbitrum':
                case 'ArbitrumGoerli':
                case 'Base':
                case 'Blast':
                case 'OPBNB':
                case 'zkSync':
                case 'Aurora':
                case 'AuroraTestnet':
                    return false
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        case 'custom':
            return true
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
