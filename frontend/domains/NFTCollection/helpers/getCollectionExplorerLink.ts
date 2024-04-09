import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NftCollectionInfo } from '@zeal/domains/NFTCollection'

export const getCollectionExplorerLink = (
    collection: NftCollectionInfo,
    networkMap: NetworkMap
) => {
    const network = findNetworkByHexChainId(collection.networkHexId, networkMap)
    return !network.blockExplorerUrl
        ? null
        : joinURL(network.blockExplorerUrl, '/address', collection.address)
}
