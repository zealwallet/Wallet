import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { Address } from '@zeal/domains/Address'
import { Network } from '@zeal/domains/Network'

export const getExplorerLink = (address: Address, network: Network) =>
    !network.blockExplorerUrl
        ? null
        : joinURL(network.blockExplorerUrl, '/address', address)
