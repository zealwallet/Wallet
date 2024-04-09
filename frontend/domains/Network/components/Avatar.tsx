import React from 'react'

import { Avatar as UIAvatar, AvatarSize } from '@zeal/uikit/Avatar'
import { BorderColor } from '@zeal/uikit/colors'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { Img } from '@zeal/uikit/Img'

import { notReachable } from '@zeal/toolkit'

import {
    CurrentNetwork,
    CustomNetwork,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import {
    AllNetwork,
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
} from '@zeal/domains/Network/components/Icons'
import { KNOWN_NETWORKS_MAP } from '@zeal/domains/Network/constants'

type Props = {
    currentNetwork: CurrentNetwork
    border?: BorderColor
    size: AvatarSize
}

export const Avatar = ({ currentNetwork, border, size }: Props) => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return <AllNetwork size={size} />
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return (
                        <PredefinedNetworkAvatar
                            border={border}
                            network={currentNetwork.network}
                            size={size}
                        />
                    )
                case 'custom':
                    return (
                        <CustomNetworkAvatar
                            border={border}
                            size={size}
                            network={currentNetwork.network}
                        />
                    )

                case 'testnet':
                    return (
                        <TestNetworkAvatar
                            border={border}
                            size={size}
                            network={currentNetwork.network}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}

const TestNetworkAvatar = ({
    size,
    border,
    network,
}: {
    size: AvatarSize
    border?: BorderColor
    network: TestNetwork
}) => {
    switch (network.name) {
        case 'PolygonMumbai':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetPolygon size={size} />
                </UIAvatar>
            )
        case 'BscTestnet':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetBNBSmartChain size={size} />
                </UIAvatar>
            )
        case 'AvalancheFuji':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetAvalanche size={size} />
                </UIAvatar>
            )
        case 'OptimismGoerli':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetOptimism size={size} />
                </UIAvatar>
            )
        case 'FantomTestnet':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetFantom size={size} />
                </UIAvatar>
            )
        case 'ArbitrumGoerli':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetArbitrum size={size} />
                </UIAvatar>
            )

        case 'EthereumSepolia':
        case 'EthereumGoerli':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetEthereum size={size} />
                </UIAvatar>
            )

        case 'AuroraTestnet':
            return (
                <UIAvatar border={border} size={size}>
                    <TestnetAurora size={size} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.name)
    }
}

const PredefinedNetworkAvatar = ({
    network,
    size,
    border,
}: {
    network: PredefinedNetwork
    border?: BorderColor
    size: AvatarSize
}) => {
    switch (network.name) {
        case 'Ethereum':
            return (
                <UIAvatar border={border} size={size}>
                    <Eth size={size} />
                </UIAvatar>
            )
        case 'Arbitrum':
            return (
                <UIAvatar border={border} size={size}>
                    <Arbitrum size={size} />
                </UIAvatar>
            )
        case 'zkSync':
            return (
                <UIAvatar border={border} size={size}>
                    <Zksync size={size} />
                </UIAvatar>
            )
        case 'BSC':
            return (
                <UIAvatar border={border} size={size}>
                    <BNB size={size} />
                </UIAvatar>
            )
        case 'Polygon':
            return (
                <UIAvatar border={border} size={size}>
                    <Polygon size={size} />
                </UIAvatar>
            )
        case 'PolygonZkevm':
            return (
                <UIAvatar border={border} size={size}>
                    <PolygonZkevm size={size} />
                </UIAvatar>
            )
        case 'Fantom':
            return (
                <UIAvatar border={border} size={size}>
                    <Fantom size={size} />
                </UIAvatar>
            )
        case 'Optimism':
            return (
                <UIAvatar border={border} size={size}>
                    <Optimism size={size} />
                </UIAvatar>
            )
        case 'Base':
            return (
                <UIAvatar border={border} size={size}>
                    <BaseIcon size={size} />
                </UIAvatar>
            )
        case 'Gnosis':
            return (
                <UIAvatar border={border} size={size}>
                    <Gnosis size={size} />
                </UIAvatar>
            )
        case 'Celo':
            return (
                <UIAvatar border={border} size={size}>
                    <Celo size={size} />
                </UIAvatar>
            )
        case 'Avalanche':
            return (
                <UIAvatar border={border} size={size}>
                    <Avalanche size={size} />
                </UIAvatar>
            )
        case 'Cronos':
            return (
                <UIAvatar border={border} size={size}>
                    <Cronos size={size} />
                </UIAvatar>
            )

        case 'Aurora':
            return (
                <UIAvatar border={border} size={size}>
                    <Aurora size={size} />
                </UIAvatar>
            )

        /* istanbul ignore next */
        default:
            return notReachable(network.name)
    }
}

export const CustomNetworkAvatar = ({
    network,
    border,
    size,
}: {
    network: CustomNetwork
    border?: BorderColor
    size: number
}) => {
    const iconUrl = iconUrlFromKnownNetworks(network.hexChainId)

    if (iconUrl) {
        return (
            <UIAvatar border={border} size={size as AvatarSize}>
                <Img size={size} src={iconUrl} />
            </UIAvatar>
        )
    } else {
        return <QuestionCircle size={size} color="iconDefault" />
    }
}

const iconUrlFromKnownNetworks = (chainId: string): string | null => {
    const chain = KNOWN_NETWORKS_MAP[chainId]

    if (!chain || !chain.icon) {
        return null
    }

    return `/chain-icons/${chain.icon}.png`
}
