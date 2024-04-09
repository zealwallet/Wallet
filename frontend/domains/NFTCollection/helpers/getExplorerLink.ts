import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Nft } from '@zeal/domains/NFTCollection'

export const getExplorerLink = (nft: Nft, networkMap: NetworkMap) => {
    const network = findNetworkByHexChainId(
        nft.collectionInfo.networkHexId,
        networkMap
    )

    if (!network.blockExplorerUrl) {
        return null
    }

    const url = joinURL(
        network.blockExplorerUrl,
        '/address',
        nft.collectionInfo.address
    )

    return `${url}?a=${BigInt(nft.tokenId).toString()}`
}
