import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { SmartContract } from '@zeal/domains/SmartContract'

export const getExplorerLink = (
    smartContract: SmartContract,
    networkMap: NetworkMap
) => {
    const network = findNetworkByHexChainId(
        smartContract.networkHexId,
        networkMap
    )
    return !network.blockExplorerUrl
        ? null
        : joinURL(network.blockExplorerUrl, '/address', smartContract.address)
}
