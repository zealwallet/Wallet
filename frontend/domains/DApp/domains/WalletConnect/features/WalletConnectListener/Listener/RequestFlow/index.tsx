import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { WalletConnectRPCRequest } from '@zeal/domains/DApp/domains/WalletConnect'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { Sign } from '@zeal/domains/RPCRequest/features/Sign'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { NetworkNotSupported } from './NetworkNotSupported'

type Props = {
    networkMap: NetworkMap
    walletConnectSessionRequest: WalletConnectRPCRequest
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    installationId: string

    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof SendTransaction>
    | MsgOf<typeof Sign>
    | MsgOf<typeof NetworkNotSupported>

type State =
    | { type: 'network_supported'; network: Network }
    | { type: 'network_not_supported' }

const calculateState = ({
    networkMap,
    walletConnectSessionRequest,
}: {
    networkMap: NetworkMap
    walletConnectSessionRequest: WalletConnectRPCRequest
}): State => {
    const network = networkMap[walletConnectSessionRequest.networkHexId]

    return network
        ? { type: 'network_supported', network }
        : { type: 'network_not_supported' }
}

export const RequestFlow = ({
    networkMap,
    walletConnectSessionRequest,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    portfolioMap,
    sessionPassword,
    keyStoreMap,
    installationId,
    networkRPCMap,
    onMsg,
}: Props) => {
    const state = calculateState({
        networkMap,
        walletConnectSessionRequest,
    })

    switch (state.type) {
        case 'network_supported': {
            switch (walletConnectSessionRequest.rpcRequest.method) {
                case 'eth_sendTransaction':
                    return (
                        <SendTransaction
                            account={
                                accountsMap[walletConnectSessionRequest.address]
                            }
                            accounts={accountsMap}
                            actionSource="extension"
                            dApp={walletConnectSessionRequest.dAppInfo}
                            feePresetMap={feePresetMap}
                            fetchSimulationByRequest={fetchSimulationByRequest}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keystores={keyStoreMap}
                            network={state.network}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolio={getPortfolio({
                                address: walletConnectSessionRequest.address,
                                portfolioMap,
                            })}
                            sendTransactionRequest={
                                walletConnectSessionRequest.rpcRequest
                            }
                            sessionPassword={sessionPassword}
                            source="walletConnect"
                            state={{ type: 'maximised' }}
                            onMsg={onMsg}
                        />
                    )

                case 'eth_signTypedData_v4':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData':
                case 'personal_sign':
                    return (
                        <Sign
                            account={
                                accountsMap[walletConnectSessionRequest.address]
                            }
                            accountsMap={accountsMap}
                            actionSource="extension"
                            dApp={walletConnectSessionRequest.dAppInfo}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStore={getKeyStore({
                                address: walletConnectSessionRequest.address,
                                keyStoreMap,
                            })}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolio={getPortfolio({
                                address: walletConnectSessionRequest.address,
                                portfolioMap,
                            })}
                            sessionPassword={sessionPassword}
                            state={{ type: 'maximised' }}
                            network={state.network}
                            request={walletConnectSessionRequest.rpcRequest}
                            onMsg={onMsg}
                        />
                    )

                default:
                    return notReachable(walletConnectSessionRequest.rpcRequest)
            }
        }

        case 'network_not_supported':
            return (
                <NetworkNotSupported
                    account={accountsMap[walletConnectSessionRequest.address]}
                    networkHexId={walletConnectSessionRequest.networkHexId}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
