import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkRPC, NetworkRPCMap } from '@zeal/domains/Network'
import { getNetworkRPC } from '@zeal/domains/Network/helpers/getNetworkRPC'

export const updateNetworkRPC = ({
    initialRPCUrl,
    network,
    networkRPCMap,
    rpcUrl,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    initialRPCUrl: string | null
    rpcUrl: string
}): NetworkRPC => {
    const currentRPC = getNetworkRPC({ network, networkRPCMap })
    const availableSet = new Set(
        currentRPC.available.map((url) => url.toLowerCase())
    )
    const newRpc = rpcUrl.toLowerCase()

    if (initialRPCUrl) {
        const initial = initialRPCUrl.toLowerCase()

        if (!availableSet.has(initial)) {
            captureError(
                new ImperativeError(
                    `initialRPCUrl is not available in the networkRPCMap`,
                    { initial, newRpc }
                )
            )
        }

        return {
            available: [
                ...Array.from(availableSet).map((url) =>
                    url === initial ? newRpc : url
                ),
            ],
            current: { type: 'custom', url: newRpc },
        }
    } else {
        return {
            available: [...Array.from(availableSet), newRpc],
            current: { type: 'custom', url: newRpc },
        }
    }
}
