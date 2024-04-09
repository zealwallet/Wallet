import { Network, NetworkRPC, NetworkRPCMap } from '@zeal/domains/Network'

export const getNetworkRPC = ({
    network,
    networkRPCMap,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
}): NetworkRPC => {
    const current = networkRPCMap[network.hexChainId]

    return (
        current || {
            current: { type: 'default' },
            available: [],
        }
    )
}
