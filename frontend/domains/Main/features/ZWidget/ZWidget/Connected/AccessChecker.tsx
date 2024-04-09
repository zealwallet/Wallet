import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { Connected as ConnectedState } from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { AddCustomNetwork } from '@zeal/domains/RPCRequest/features/AddCustomNetwork'
import { Msg as SignMsg, Sign } from '@zeal/domains/RPCRequest/features/Sign'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { DataLoader } from './DataLoader'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null
    customCurrencies: CustomCurrencyMap

    account: Account
    network: Network
    keyStore: KeyStore

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    portfolioMap: PortfolioMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    interactionRequest: InteractionRequest

    connectionState: ConnectedState
    state: State

    installationId: string

    onMsg: (msg: Msg) => void
}

type State = { type: 'minimised' } | { type: 'maximised' }

export type Msg =
    | MsgOf<typeof LockScreen>
    | MsgOf<typeof DataLoader>
    | SignMsg
    | MsgOf<typeof AddCustomNetwork>

type InternalState =
    | { type: 'locked' }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
}: {
    sessionPassword: string | null
}): InternalState => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }
    return { type: 'locked' }
}

export const AccessChecker = ({
    account,
    keyStore,
    connectionState,
    interactionRequest,
    network,
    sessionPassword,
    encryptedPassword,
    state,
    accounts,
    keystores,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolioMap,
    customCurrencies,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    const internalState = calculateState({ sessionPassword })

    switch (internalState.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            switch (interactionRequest.method) {
                case 'eth_requestAccounts':
                case 'wallet_requestPermissions':
                    return null
                case 'eth_sendTransaction':
                    return (
                        <DataLoader
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            customCurrencies={customCurrencies}
                            sessionPassword={internalState.sessionPassword}
                            account={account}
                            network={network}
                            accounts={accounts}
                            keystores={keystores}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            feePresetMap={feePresetMap}
                            portfolioMap={portfolioMap}
                            sendTransactionRequest={interactionRequest}
                            connectionState={connectionState}
                            state={state}
                            installationId={installationId}
                            onMsg={onMsg}
                        />
                    )

                case 'eth_signTypedData_v4':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData':
                case 'personal_sign':
                    return (
                        <Sign
                            accountsMap={accounts}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStoreMap={keystores}
                            portfolio={getPortfolio({
                                address: account.address,
                                portfolioMap: portfolioMap,
                            })}
                            networkRPCMap={networkRPCMap}
                            networkMap={networkMap}
                            state={state}
                            sessionPassword={internalState.sessionPassword}
                            keyStore={keyStore}
                            request={interactionRequest}
                            account={account}
                            dApp={connectionState.dApp}
                            network={network}
                            actionSource="zwidget"
                            onMsg={onMsg}
                        />
                    )

                case 'wallet_addEthereumChain':
                    return (
                        <AddCustomNetwork
                            installationId={installationId}
                            request={interactionRequest}
                            visualState={state}
                            account={account}
                            dApp={connectionState.dApp}
                            network={network}
                            onMsg={onMsg}
                            keyStore={keyStore}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(interactionRequest)
            }

        /* istanbul ignore next */
        default:
            return notReachable(internalState)
    }
}
