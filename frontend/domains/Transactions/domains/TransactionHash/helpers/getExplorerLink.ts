import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { Network } from '@zeal/domains/Network'

import { TransactionHash } from '..'

export const getExplorerLink = (hash: TransactionHash, network: Network) =>
    !network.blockExplorerUrl
        ? null
        : joinURL(network.blockExplorerUrl, '/tx', hash.transactionHash)
