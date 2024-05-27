import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'

import { DataLoader, Msg as DataLoaderMsg } from './DataLoader'
import { SpeedUpsIsNotSupportedPopup } from './SpeedUpsIsNotSupportedPopup'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | DataLoaderMsg

export const SpeedUp = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
    source,
    keyStore,
    installationId,
}: Props) => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'Arbitrum':
                case 'zkSync':
                case 'ArbitrumGoerli':
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Base':
                    return (
                        <SpeedUpsIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )
                case 'Blast':
                    return (
                        <SpeedUpsIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )
                case 'OPBNB':
                    return (
                        <SpeedUpsIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )
                case 'PolygonMumbai':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'FantomTestnet':
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'BSC':
                case 'Polygon':
                case 'PolygonZkevm':
                case 'Linea':
                case 'Fantom':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Cronos':
                case 'Aurora':
                case 'AuroraTestnet':
                    return (
                        <DataLoader
                            source={source}
                            keyStore={keyStore}
                            installationId={installationId}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            transactionRequest={transactionRequest}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
            return (
                <DataLoader
                    source={source}
                    keyStore={keyStore}
                    installationId={installationId}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
