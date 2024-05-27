import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'

import { SimulateCancelPopup } from './SimulateCancelPopup'
import { StopIsNotSupportedPopup } from './StopIsNotSupportedPopup'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof StopIsNotSupportedPopup>
    | MsgOf<typeof SimulateCancelPopup>

export const SimulateCancel = ({
    transactionRequest,
    networkMap,
    keyStore,
    source,
    installationId,
    networkRPCMap,
    onMsg,
}: Props) => {
    const network = findNetworkByHexChainId(
        transactionRequest.networkHexId,
        networkMap
    )

    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            switch (network.name) {
                case 'Arbitrum':
                case 'zkSync':
                case 'ArbitrumGoerli':
                case 'Optimism':
                case 'OptimismGoerli':
                case 'Base':
                case 'OPBNB':
                case 'Blast':
                    return (
                        <StopIsNotSupportedPopup
                            network={network}
                            onMsg={onMsg}
                        />
                    )

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
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'PolygonMumbai':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'FantomTestnet':
                case 'AuroraTestnet':
                    return (
                        <SimulateCancelPopup
                            installationId={installationId}
                            keyStore={keyStore}
                            source={source}
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

        case 'custom':
            return (
                <SimulateCancelPopup
                    installationId={installationId}
                    keyStore={keyStore}
                    source={source}
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
