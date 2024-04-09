import React from 'react'

import { Badge as UIBadge, BadgeSize } from '@zeal/uikit/Avatar'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'

import { notReachable } from '@zeal/toolkit'

import { Network } from '@zeal/domains/Network'

import {
    Arbitrum,
    Aurora,
    Avalanche,
    Base as BaseIcon,
    BNB,
    Celo,
    Cronos,
    Eth,
    Fantom,
    Gnosis,
    Optimism,
    Polygon,
    PolygonZkevm,
    TestnetArbitrum,
    TestnetAurora,
    TestnetAvalanche,
    TestnetBNBSmartChain,
    TestnetEthereum,
    TestnetFantom,
    TestnetOptimism,
    TestnetPolygon,
    Zksync,
} from './Icons'

type Props = {
    network: Network
    size: BadgeSize
}

export const Badge = ({ network, size }: Props) => {
    switch (network.type) {
        case 'predefined':
            switch (network.name) {
                case 'Ethereum':
                    return (
                        <UIBadge size={size}>
                            <Eth size={size} />
                        </UIBadge>
                    )
                case 'Arbitrum':
                    return (
                        <UIBadge size={size}>
                            <Arbitrum size={size} />
                        </UIBadge>
                    )
                case 'zkSync':
                    return (
                        <UIBadge size={size}>
                            <Zksync size={size} />
                        </UIBadge>
                    )
                case 'BSC':
                    return (
                        <UIBadge size={size}>
                            <BNB size={size} />
                        </UIBadge>
                    )
                case 'Polygon':
                    return (
                        <UIBadge size={size}>
                            <Polygon size={size} />
                        </UIBadge>
                    )
                case 'PolygonZkevm':
                    return (
                        <UIBadge size={size}>
                            <PolygonZkevm size={size} />
                        </UIBadge>
                    )
                case 'Fantom':
                    return (
                        <UIBadge size={size}>
                            <Fantom size={size} />
                        </UIBadge>
                    )
                case 'Optimism':
                    return (
                        <UIBadge size={size}>
                            <Optimism size={size} />
                        </UIBadge>
                    )
                case 'Base':
                    return (
                        <UIBadge size={size}>
                            <BaseIcon size={size} />
                        </UIBadge>
                    )
                case 'Gnosis':
                    return (
                        <UIBadge size={size}>
                            <Gnosis size={size} />
                        </UIBadge>
                    )
                case 'Celo':
                    return (
                        <UIBadge size={size}>
                            <Celo size={size} />
                        </UIBadge>
                    )
                case 'Avalanche':
                    return (
                        <UIBadge size={size}>
                            <Avalanche size={size} />
                        </UIBadge>
                    )
                case 'Cronos':
                    return (
                        <UIBadge size={size}>
                            <Cronos size={size} />
                        </UIBadge>
                    )
                case 'Aurora':
                    return (
                        <UIBadge size={size}>
                            <Aurora size={size} />
                        </UIBadge>
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        case 'custom':
            return (
                <UIBadge size={size}>
                    <QuestionCircle size={size} color="iconDefault" />
                </UIBadge>
            )
        case 'testnet':
            switch (network.name) {
                case 'PolygonMumbai':
                    return (
                        <UIBadge size={size}>
                            <TestnetPolygon size={size} />
                        </UIBadge>
                    )
                case 'BscTestnet':
                    return (
                        <UIBadge size={size}>
                            <TestnetBNBSmartChain size={size} />
                        </UIBadge>
                    )
                case 'AvalancheFuji':
                    return (
                        <UIBadge size={size}>
                            <TestnetAvalanche size={size} />
                        </UIBadge>
                    )
                case 'OptimismGoerli':
                    return (
                        <UIBadge size={size}>
                            <TestnetOptimism size={size} />
                        </UIBadge>
                    )
                case 'FantomTestnet':
                    return (
                        <UIBadge size={size}>
                            <TestnetFantom size={size} />
                        </UIBadge>
                    )
                case 'ArbitrumGoerli':
                    return (
                        <UIBadge size={size}>
                            <TestnetArbitrum size={size} />
                        </UIBadge>
                    )

                case 'EthereumSepolia':
                case 'EthereumGoerli':
                    return (
                        <UIBadge size={size}>
                            <TestnetEthereum size={size} />
                        </UIBadge>
                    )
                case 'AuroraTestnet':
                    return (
                        <UIBadge size={size}>
                            <TestnetAurora size={size} />
                        </UIBadge>
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
