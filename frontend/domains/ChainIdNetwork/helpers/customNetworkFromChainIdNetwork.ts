import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { CustomNetwork } from '@zeal/domains/Network'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'

export const customNetworkFromChainIdNetwork = (
    network: ChainIdNetwork
): CustomNetwork => {
    const chainId = network.chainId
    const rpcUrl = network.rpcUrls[0]

    const address = parseAddress(
        '0x0000000000000000000000000000000000000000'
    ).getSuccessResultOrThrow('parse const address')

    return {
        type: 'custom',
        hexChainId: chainId,
        blockExplorerUrl:
            network.blockExplorerUrls.length === 0
                ? null
                : network.blockExplorerUrls[0],
        defaultRpcUrl: rpcUrl,
        rpcUrl,
        isSimulationSupported: false,
        isZealRPCSupported: false,
        isSafeSupported: false,
        name: network.name,
        nativeCurrency: initCustomCurrency({
            address,
            id: [network.name, address].join('|'),
            fraction: network.nativeCurrency.decimals,
            icon: iconUrlFromKnownNetworks(chainId),
            networkHexChainId: chainId,
            symbol: network.nativeCurrency.symbol,
        }),
        trxType: 'legacy',
    }
}

const iconUrlFromKnownNetworks = (chainId: string): string | null => {
    const chain = KNOWN_NETWORKS_MAP[chainId]

    if (!chain || !chain.icon) {
        return null
    }

    return `/chain-icons/${chain.icon}.png`
}
