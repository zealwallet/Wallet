import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { fetchNetworks } from '@zeal/domains/ChainIdNetwork/api/fetchNetworks'
import { ImperativeError } from '@zeal/domains/Error'

export const fetchNetwork = async (
    chainId: string
): Promise<ChainIdNetwork> => {
    return fetchNetworks().then((chains) => {
        const network = chains.find((c) => c.chainId === chainId)

        if (!network) {
            throw new ImperativeError('Chain not found in chainid.network', {
                chainId,
            })
        }

        return network
    })
}
