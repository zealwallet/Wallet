import { values } from '@zeal/toolkit/Object'

import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'

export const getAllNetworksFromNetworkMap = (
    networkMap: NetworkMap
): CurrentNetwork[] => {
    return [
        { type: 'all_networks' } as const,
        ...values(networkMap).map(
            (network): CurrentNetwork => ({
                type: 'specific_network',
                network,
            })
        ),
    ]
}
