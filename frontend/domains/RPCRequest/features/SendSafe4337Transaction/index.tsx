import { components } from '@zeal/api/portfolio'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { UnsupportedSafeNetworkLayout } from '@zeal/domains/KeyStore/components/UnsupportedSafeNetworkLayout'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

import { Flow } from './Flow'

type Props = {
    keyStore: Safe4337
    network: Network
    networkRPCMap: NetworkRPCMap
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    dAppInfo: DAppSiteInfo | null
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    portfolio: Portfolio | null
    state: VisualState
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg = MsgOf<typeof Flow> | { type: 'on_wrong_network_accepted' }

export const SendSafe4337Transaction = ({
    keyStore,
    network,
    networkRPCMap,
    rpcRequestToBundle,
    sessionPassword,
    accountsMap,
    networkMap,
    keyStoreMap,
    account,
    dAppInfo,
    onMsg,
    portfolio,
    state,
    gasCurrencyPresetMap,
    source,
    actionSource,
    installationId,
}: Props) =>
    network.isSafeSupported ? (
        <Flow
            source={source}
            installationId={installationId}
            gasCurrencyPresetMap={gasCurrencyPresetMap}
            state={state}
            accountsMap={accountsMap}
            keyStoreMap={keyStoreMap}
            networkMap={networkMap}
            account={account}
            dAppInfo={dAppInfo}
            keyStore={keyStore}
            network={network}
            networkRPCMap={networkRPCMap}
            sessionPassword={sessionPassword}
            rpcRequestToBundle={rpcRequestToBundle}
            portfolio={portfolio}
            actionSource={actionSource}
            onMsg={onMsg}
        />
    ) : (
        <UnsupportedSafeNetworkLayout
            installationId={installationId}
            account={account}
            network={network}
            state={state}
            actionSource={actionSource}
            onMsg={onMsg}
        />
    )
