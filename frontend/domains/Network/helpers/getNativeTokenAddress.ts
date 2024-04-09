import { notReachable } from '@zeal/toolkit'

import { Address } from '@zeal/domains/Address'
import { Network, NetworkHexId, NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

export const getNativeTokenAddress = (network: Network): Address => {
    switch (network.type) {
        case 'predefined':
            return network.gasTokenAddress
        case 'custom':
        case 'testnet':
            return network.nativeCurrency.address
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}

export const getNativeAddressByNetworkId = (
    networkHexId: NetworkHexId,
    networkMap: NetworkMap
): Address =>
    getNativeTokenAddress(findNetworkByHexChainId(networkHexId, networkMap))
