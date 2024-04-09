import { notReachable } from '@zeal/toolkit'

import { ImperativeError } from '@zeal/domains/Error'
import { NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'

type OpenSeaNetwork =
    | 'ethereum'
    | 'arbitrum'
    | 'bsc'
    | 'matic'
    | 'avalanche'
    | 'optimism'

const getOpenSeaNetwork = ({
    networkHexId,
    networkMap,
}: {
    networkMap: NetworkMap
    networkHexId: NetworkHexId
}): OpenSeaNetwork => {
    const network = networkMap[networkHexId]

    if (!network) {
        throw new ImperativeError(
            `Unknown network when getting OpenSea network part`,
            { networkHexId }
        )
    }

    switch (network.type) {
        case 'predefined':
            switch (network.name) {
                case 'Ethereum':
                    return 'ethereum'

                case 'Arbitrum':
                    return 'arbitrum'

                case 'BSC':
                    return 'bsc'

                case 'Polygon':
                    return 'matic'

                case 'Avalanche':
                    return 'avalanche'

                case 'Optimism':
                    return 'optimism'

                case 'Fantom':
                case 'PolygonZkevm':
                case 'Gnosis':
                case 'Celo':
                case 'Cronos':
                case 'Aurora':
                case 'Base':
                case 'zkSync':
                    throw new ImperativeError(
                        `Network not supported for OpenSea`,
                        { network: network.hexChainId }
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
        case 'testnet':
            throw new ImperativeError(`Network  not supported for OpenSea`, {
                network: network.hexChainId,
            })

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

export const getOpenSeeLink = (
    nftCollection: PortfolioNFTCollection,
    nft: PortfolioNFT,
    networkMap: NetworkMap
): string =>
    `https://opensea.io/assets/${getOpenSeaNetwork({
        networkHexId: nftCollection.networkHexId,
        networkMap,
    })}/${nftCollection.mintAddress}/${nft.tokenId}`
