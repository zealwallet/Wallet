import { values } from '@zeal/toolkit/Object'

import { Address } from '@zeal/domains/Address'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { ImperativeError } from '@zeal/domains/Error'
import {
    Network,
    NetworkHexId,
    NetworkMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { getChainIdNumber } from '@zeal/domains/Network/helpers/getChainIdNumber'

import { KNOWN_NETWORKS, KnownNetwork } from './chains'

export const KNOWN_NETWORKS_MAP: Record<string, KnownNetwork> =
    KNOWN_NETWORKS.reduce(
        (acc, network) => ({
            ...acc,
            [network.hexChainId]: network,
        }),
        {}
    )

const parseStaticAddress = (str: string): Address =>
    parseAddress(str).getSuccessResultOrThrow(
        `Failed to parse static address ${str}`
    )

// Do not export this one, it is used only for not to forget to add new networks to the array if new type is added
const PREDEFINED_NETWORKS_MAP: {
    [K in PredefinedNetwork['name']]: Omit<PredefinedNetwork, 'name'> & {
        name: K
    }
} = {
    Ethereum: {
        type: 'predefined',
        blockExplorerUrl: 'https://etherscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x1' as NetworkHexId, // TODO :: use parse for network
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Ethereum',
        trxType: 'eip1559',
    },
    Polygon: {
        type: 'predefined',
        blockExplorerUrl: 'https://polygonscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000001010'
        ),
        hexChainId: '0x89' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Polygon',
        trxType: 'eip1559',
    },
    PolygonZkevm: {
        type: 'predefined',
        blockExplorerUrl: 'https://zkevm.polygonscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x44d' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false, // TODO: @Nicvaniek - disabled until we find a fix for https://discord.com/channels/961390365708009524/1217199787980357743/1222436704884101181
        name: 'PolygonZkevm',
        trxType: 'legacy',
    },
    Linea: {
        type: 'predefined',
        blockExplorerUrl: 'https://lineascan.build/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xe708' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'Linea',
        trxType: 'legacy',
    },
    Arbitrum: {
        type: 'predefined',
        blockExplorerUrl: 'https://arbiscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa4b1' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Arbitrum',
        trxType: 'legacy',
    },
    zkSync: {
        type: 'predefined',
        blockExplorerUrl: 'https://explorer.zksync.io/',
        gasTokenAddress: parseStaticAddress(
            '0x000000000000000000000000000000000000800A'
        ),
        hexChainId: '0x144' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'zkSync',
        trxType: 'legacy',
    },
    Aurora: {
        type: 'predefined',
        blockExplorerUrl: 'https://aurorascan.dev/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x4e454152' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'Aurora',
        trxType: 'legacy',
    },
    Avalanche: {
        type: 'predefined',
        blockExplorerUrl: 'https://snowtrace.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa86a' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Avalanche',
        trxType: 'eip1559',
    },
    BSC: {
        type: 'predefined',
        blockExplorerUrl: 'https://www.bscscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x38' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'BSC',
        trxType: 'legacy',
    },
    Celo: {
        type: 'predefined',
        blockExplorerUrl: 'https://celoscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x471ece3750da237f93b8e339c536989b8978a438'
        ),
        hexChainId: '0xa4ec' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'Celo',
        trxType: 'legacy',
    },
    Fantom: {
        type: 'predefined',
        blockExplorerUrl: 'https://ftmscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xfa' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'Fantom',
        trxType: 'legacy',
    },
    Gnosis: {
        type: 'predefined',
        blockExplorerUrl: 'https://gnosisscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x44fa8e6f47987339850636f88629646662444217'
        ),
        hexChainId: '0x64' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Gnosis',
        trxType: 'eip1559',
    },
    Optimism: {
        type: 'predefined',
        blockExplorerUrl: 'https://optimistic.etherscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xa' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Optimism',
        trxType: 'legacy',
    },
    Base: {
        type: 'predefined',
        blockExplorerUrl: 'https://basescan.org/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x2105' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Base',
        trxType: 'legacy',
    },
    Blast: {
        type: 'predefined',
        blockExplorerUrl: 'https://blastscan.io/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x13e31' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        name: 'Blast',
        trxType: 'legacy',
    },
    OPBNB: {
        type: 'predefined',
        blockExplorerUrl: 'https://opbnbscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0xcc' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'OPBNB',
        trxType: 'legacy',
    },
    Cronos: {
        type: 'predefined',
        blockExplorerUrl: 'https://cronoscan.com/',
        gasTokenAddress: parseStaticAddress(
            '0x0000000000000000000000000000000000000000'
        ),
        hexChainId: '0x19' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        name: 'Cronos',
        trxType: 'legacy',
    },
}

// Do not export this one, it is used only for not to forget to add new networks to the array if new type is added
const TEST_NETWORKS_MAP: {
    [K in TestNetwork['name']]: Omit<TestNetwork, 'name'> & {
        name: K
    }
} = {
    ArbitrumGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli.arbiscan.io/',
        hexChainId: '0x66eed' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'legacy',
        name: 'ArbitrumGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x66eed' as NetworkHexId,
            fraction: 18,
            id: `ArbitrumGoerli|0x0000000000000000000000000000000000000000`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    AuroraTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://explorer.testnet.aurora.dev/',
        hexChainId: '0x4e454153' as NetworkHexId,
        isSimulationSupported: false,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'legacy',
        name: 'AuroraTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x4e454153' as NetworkHexId,
            fraction: 18,
            id: `AuroraTestnet|0x0000000000000000000000000000000000000000`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    AvalancheFuji: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.snowtrace.io/',
        hexChainId: '0xa869' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'eip1559',
        name: 'AvalancheFuji',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xa869' as NetworkHexId,
            fraction: 18,
            id: `AvalancheFuji|0x0000000000000000000000000000000000000000`,
            symbol: 'AVAX',
            icon: null,
        }),
    },
    BscTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.bscscan.com/',
        hexChainId: '0x61' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'legacy',
        name: 'BscTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x61' as NetworkHexId,
            fraction: 18,
            id: `BscTestnet|0x0000000000000000000000000000000000000000`,
            symbol: 'BNB',
            icon: null,
        }),
    },
    EthereumGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli.etherscan.io/',
        hexChainId: '0x5' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'eip1559',
        name: 'EthereumGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x5' as NetworkHexId,
            fraction: 18,
            id: `EthereumGoerli|0x0000000000000000000000000000000000000000`,
            symbol: 'goETH',
            icon: null,
        }),
    },
    EthereumSepolia: {
        type: 'testnet',
        blockExplorerUrl: 'https://sepolia.etherscan.io/',
        hexChainId: '0xaa36a7' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: true,
        trxType: 'eip1559',
        name: 'EthereumSepolia',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xaa36a7' as NetworkHexId,
            fraction: 18,
            id: `EthereumSepolia|0x0000000000000000000000000000000000000000`,
            symbol: 'spETH',
            icon: null,
        }),
    },
    FantomTestnet: {
        type: 'testnet',
        blockExplorerUrl: 'https://testnet.ftmscan.com/',
        hexChainId: '0xfa2' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'legacy',
        name: 'FantomTestnet',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0xfa2' as NetworkHexId,
            fraction: 18,
            id: `FantomTestnet|0x0000000000000000000000000000000000000000`,
            symbol: 'FTM',
            icon: null,
        }),
    },
    OptimismGoerli: {
        type: 'testnet',
        blockExplorerUrl: 'https://goerli-optimism.etherscan.io/',
        hexChainId: '0x1a4' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'legacy',
        name: 'OptimismGoerli',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000000000'
            ),
            networkHexChainId: '0x1a4' as NetworkHexId,
            fraction: 18,
            id: `OptimismGoerli|0x0000000000000000000000000000000000000000`,
            symbol: 'ETH',
            icon: null,
        }),
    },
    PolygonMumbai: {
        type: 'testnet',
        blockExplorerUrl: 'https://mumbai.polygonscan.com/',
        hexChainId: '0x13881' as NetworkHexId,
        isSimulationSupported: true,
        isZealRPCSupported: true,
        isSafeSupported: false,
        trxType: 'eip1559',
        name: 'PolygonMumbai',
        nativeCurrency: initCustomCurrency({
            address: parseStaticAddress(
                '0x0000000000000000000000000000000000001010'
            ),
            networkHexChainId: '0x13881' as NetworkHexId,
            fraction: 18,
            id: `PolygonMumbai|0x0000000000000000000000000000000000001010`,
            symbol: 'MATIC',
            icon: null,
        }),
    },
}

export const ARBITRUM = PREDEFINED_NETWORKS_MAP['Arbitrum']
export const BASE = PREDEFINED_NETWORKS_MAP['Base']
export const POLYGON = PREDEFINED_NETWORKS_MAP['Polygon']
export const GNOSIS = PREDEFINED_NETWORKS_MAP['Gnosis']

export const PREDEFINED_NETWORKS: PredefinedNetwork[] = values(
    PREDEFINED_NETWORKS_MAP
)

export const TEST_NETWORKS: TestNetwork[] = values(TEST_NETWORKS_MAP)

export const PREDEFINED_AND_TEST_NETWORKS: (PredefinedNetwork | TestNetwork)[] =
    [...PREDEFINED_NETWORKS, ...TEST_NETWORKS]

export const SMART_WALLET_REFERENCE_NETWORK = PREDEFINED_NETWORKS_MAP['Gnosis']

export const findNetworkByNumber = (
    networkId: number
): TestNetwork | PredefinedNetwork => {
    const network = PREDEFINED_AND_TEST_NETWORKS.find(
        (n) => getChainIdNumber(n) === networkId
    )
    if (!network) {
        throw new ImperativeError(`cannot find network id`, { networkId })
    }
    return network
}

export const findNetworkByHexChainId = (
    hexChanId: NetworkHexId,
    networkMap: NetworkMap
): Network => {
    const network = networkMap[hexChanId]
    if (!network) {
        throw new ImperativeError(`cannot find network for hexchainid`, {
            hexChanId,
        })
    }
    return network
}

export const DEFAULT_NETWORK = PREDEFINED_NETWORKS[0]
