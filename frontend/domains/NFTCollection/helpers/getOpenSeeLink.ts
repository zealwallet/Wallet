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
    | 'blast'
    | 'base'

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

                case 'Blast':
                    return 'blast'

                case 'Base':
                    return 'base'

                case 'Aurora':
                case 'Celo':
                case 'Cronos':
                case 'Fantom':
                case 'Gnosis':
                case 'Linea':
                case 'OPBNB':
                case 'PolygonZkevm':
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
