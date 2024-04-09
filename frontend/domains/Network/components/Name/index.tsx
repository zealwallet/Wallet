import React from 'react'
import { FormattedMessage } from 'react-intl'

import { notReachable } from '@zeal/toolkit'

import { CurrentNetwork } from '@zeal/domains/Network'

type Props = {
    currentNetwork: CurrentNetwork
}

export const Name = ({ currentNetwork }: Props) => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return (
                <FormattedMessage
                    id="network.name.allNetworks"
                    defaultMessage="All Networks"
                />
            )
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                case 'testnet':
                    switch (currentNetwork.network.name) {
                        case 'Ethereum':
                            return (
                                <FormattedMessage
                                    id="network.name.Ethereum"
                                    defaultMessage="Ethereum"
                                />
                            )

                        case 'Arbitrum':
                            return (
                                <FormattedMessage
                                    id="network.name.Arbitrum"
                                    defaultMessage="Arbitrum"
                                />
                            )

                        case 'zkSync':
                            return (
                                <FormattedMessage
                                    id="network.name.zkSync"
                                    defaultMessage="zkSync"
                                />
                            )

                        case 'BSC':
                            return (
                                <FormattedMessage
                                    id="network.name.BSC"
                                    defaultMessage="BNB Chain"
                                />
                            )

                        case 'Polygon':
                            return (
                                <FormattedMessage
                                    id="network.name.Polygon"
                                    defaultMessage="Polygon"
                                />
                            )
                        case 'PolygonZkevm':
                            return (
                                <FormattedMessage
                                    id="network.name.PolygonZkevm"
                                    defaultMessage="Polygon zkEVM"
                                />
                            )
                        case 'Fantom':
                            return (
                                <FormattedMessage
                                    id="network.name.Fantom"
                                    defaultMessage="Fantom"
                                />
                            )
                        case 'Optimism':
                            return (
                                <FormattedMessage
                                    id="network.name.Optimism"
                                    defaultMessage="Optimism"
                                />
                            )
                        case 'Base':
                            return (
                                <FormattedMessage
                                    id="network.name.Base"
                                    defaultMessage="Base"
                                />
                            )
                        case 'Gnosis':
                            return (
                                <FormattedMessage
                                    id="network.name.Gnosis"
                                    defaultMessage="Gnosis"
                                />
                            )

                        case 'Celo':
                            return (
                                <FormattedMessage
                                    id="network.name.Celo"
                                    defaultMessage="Celo"
                                />
                            )

                        case 'Avalanche':
                            return (
                                <FormattedMessage
                                    id="network.name.Avalanche"
                                    defaultMessage="Avalanche"
                                />
                            )

                        case 'Cronos':
                            return (
                                <FormattedMessage
                                    id="network.name.Cronos"
                                    defaultMessage="Cronos"
                                />
                            )
                        case 'Aurora':
                            return (
                                <FormattedMessage
                                    id="network.name.Aurora"
                                    defaultMessage="Aurora"
                                />
                            )

                        case 'EthereumGoerli':
                            return (
                                <FormattedMessage
                                    id="network.name.EthereumGoerli"
                                    defaultMessage="Ethereum Goerli"
                                />
                            )
                        case 'EthereumSepolia':
                            return (
                                <FormattedMessage
                                    id="network.name.EthereumSepolia"
                                    defaultMessage="Ethereum Sepolia"
                                />
                            )

                        case 'PolygonMumbai':
                            return (
                                <FormattedMessage
                                    id="network.name.PolygonMumbai"
                                    defaultMessage="Polygon Mumbai"
                                />
                            )
                        case 'BscTestnet':
                            return (
                                <FormattedMessage
                                    id="network.name.BscTestnet"
                                    defaultMessage="BNB Chain Testnet"
                                />
                            )
                        case 'AvalancheFuji':
                            return (
                                <FormattedMessage
                                    id="network.name.AvalancheFuji"
                                    defaultMessage="Avalanche Fuji"
                                />
                            )
                        case 'OptimismGoerli':
                            return (
                                <FormattedMessage
                                    id="network.name.OptimismGoerli"
                                    defaultMessage="Optimism Goerli"
                                />
                            )
                        case 'FantomTestnet':
                            return (
                                <FormattedMessage
                                    id="network.name.FantomTestnet"
                                    defaultMessage="Fantom Testnet"
                                />
                            )
                        case 'ArbitrumGoerli':
                            return (
                                <FormattedMessage
                                    id="network.name.ArbitrumGoerli"
                                    defaultMessage="Arbitrum Goerli"
                                />
                            )
                        case 'AuroraTestnet':
                            return (
                                <FormattedMessage
                                    id="network.name.AuroraTestnet"
                                    defaultMessage="Aurora Testnet"
                                />
                            )

                        /* istanbul ignore next */
                        default:
                            return notReachable(currentNetwork.network)
                    }
                case 'custom':
                    return <>{currentNetwork.network.name}</>

                /* istanbul ignore next */
                default:
                    return notReachable(currentNetwork.network)
            }
        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
