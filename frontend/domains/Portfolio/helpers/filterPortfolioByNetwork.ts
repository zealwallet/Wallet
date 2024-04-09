import { notReachable } from '@zeal/toolkit'

import { CurrentNetwork, NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'

const showNetworkAssetOnAllNetworks = ({
    networkHexId,
    networkMap,
}: {
    networkHexId: NetworkHexId
    networkMap: NetworkMap
}): boolean => {
    const network = networkMap[networkHexId] || null

    if (!network) {
        return false
    }

    switch (network.type) {
        case 'predefined':
            return true

        case 'custom': {
            const knownNetwork = KNOWN_NETWORKS_MAP[networkHexId]

            if (!knownNetwork) {
                return false
            }

            switch (knownNetwork.type) {
                case 'mainnet':
                    return true

                case 'testnet':
                    return false
                /* istanbul ignore next */
                default:
                    return notReachable(knownNetwork.type)
            }
        }

        case 'testnet':
            return false

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

export const filterPortfolioByNetwork = (
    portfolio: Portfolio,
    currentNetwork: CurrentNetwork,
    networkMap: NetworkMap
): Portfolio => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return {
                currencies: portfolio.currencies,
                tokens: portfolio.tokens.filter((token) =>
                    showNetworkAssetOnAllNetworks({
                        networkHexId: token.networkHexId,
                        networkMap,
                    })
                ),
                apps: portfolio.apps.filter((app) =>
                    showNetworkAssetOnAllNetworks({
                        networkHexId: app.networkHexId,
                        networkMap,
                    })
                ),
                nftCollections: portfolio.nftCollections.filter(
                    (nftCollection) =>
                        showNetworkAssetOnAllNetworks({
                            networkHexId: nftCollection.networkHexId,
                            networkMap,
                        })
                ),
            }

        case 'specific_network':
            return {
                currencies: portfolio.currencies,
                tokens: portfolio.tokens.filter(
                    (token) =>
                        token.networkHexId === currentNetwork.network.hexChainId
                ),
                apps: portfolio.apps.filter(
                    (app) =>
                        app.networkHexId === currentNetwork.network.hexChainId
                ),
                nftCollections: portfolio.nftCollections.filter(
                    (nft) =>
                        nft.networkHexId === currentNetwork.network.hexChainId
                ),
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
