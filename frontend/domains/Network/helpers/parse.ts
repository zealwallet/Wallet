import {
    bigint,
    failure,
    oneOf,
    Result,
    string,
    success,
} from '@zeal/toolkit/Result'

import {
    NetworkHexId,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { PREDEFINED_AND_TEST_NETWORKS } from '@zeal/domains/Network/constants'

const MAPPER: Record<(PredefinedNetwork | TestNetwork)['name'], true> = {
    Ethereum: true,
    Arbitrum: true,
    zkSync: true,
    BSC: true,
    Polygon: true,
    PolygonZkevm: true,
    Fantom: true,
    Optimism: true,
    Base: true,
    Gnosis: true,
    Celo: true,
    Avalanche: true,
    Cronos: true,
    Aurora: true,
    EthereumGoerli: true,
    EthereumSepolia: true,
    ArbitrumGoerli: true,
    AvalancheFuji: true,
    BscTestnet: true,
    FantomTestnet: true,
    OptimismGoerli: true,
    PolygonMumbai: true,
    AuroraTestnet: true,
}

const parseNetworkHexIdFromNetworkName = (
    input: unknown
): Result<unknown, NetworkHexId> => {
    const networkName = MAPPER[input as keyof typeof MAPPER]
        ? success(input as keyof typeof MAPPER)
        : failure(`cannot map network: ${input}`)

    return networkName.andThen((name) => {
        const network =
            PREDEFINED_AND_TEST_NETWORKS.find(
                (network) => network.name === name
            ) || null

        return network
            ? success(network.hexChainId)
            : failure(`cannot find network: ${name}`)
    })
}

export const parseNetworkHexId = (
    input: unknown
): Result<unknown, NetworkHexId> =>
    string(input)
        .andThen((str) => bigint(str))
        .andThen((int) => success(`0x${int.toString(16)}` as NetworkHexId))

export const parse = (input: unknown): Result<unknown, NetworkHexId> =>
    oneOf(input, [
        parseNetworkHexIdFromNetworkName(input),
        parseNetworkHexId(input),
    ])
