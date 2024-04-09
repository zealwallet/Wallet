import { number } from '@zeal/toolkit/Result'

import { Network } from '@zeal/domains/Network'

export const getChainIdNumber = (network: Network): number => {
    return number(parseInt(network.hexChainId, 16)).getSuccessResultOrThrow(
        'cannot parse chain id from hex to number'
    )
}
