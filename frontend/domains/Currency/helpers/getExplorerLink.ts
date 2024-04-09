import { notReachable } from '@zeal/toolkit'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

export const getExplorerLink = (
    currency: CryptoCurrency,
    networkMap: NetworkMap
): string | null => {
    const network = findNetworkByHexChainId(
        currency.networkHexChainId,
        networkMap
    )

    switch (network.type) {
        case 'predefined': {
            switch (network.name) {
                case 'Ethereum':
                case 'Arbitrum':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Cronos':
                case 'Aurora':
                    return `${network.blockExplorerUrl}/token/${currency.address}`
                case 'zkSync':
                    return `${network.blockExplorerUrl}/address/${currency.address}`
                default:
                    return notReachable(network)
            }
        }
        case 'testnet':
            return `${network.blockExplorerUrl}/token/${currency.address}`

        case 'custom':
            return !network.blockExplorerUrl
                ? null
                : `${network.blockExplorerUrl}/token/${currency.address}`

        default:
            return notReachable(network)
    }
}
