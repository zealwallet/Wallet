import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { UnsupportedSafeNetworkLayout } from '@zeal/domains/KeyStore/components/UnsupportedSafeNetworkLayout'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { CheckSafe4337Deployment } from './CheckSafe4337Deployment'
import { Signing, State as SigningVisualState } from './Signing'
// https://docs.metamask.io/wallet/how-to/sign-data/

type Props = {
    sessionPassword: string
    keyStore: KeyStore
    request:
        | PersonalSign
        | EthSignTypedData
        | EthSignTypedDataV3
        | EthSignTypedDataV4

    state: State

    account: Account
    dApp: DAppSiteInfo
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource

    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolio: Portfolio | null

    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Signing>
    | MsgOf<typeof CheckSafe4337Deployment>
    | { type: 'on_wrong_network_accepted' }

export type State = SigningVisualState

export const Sign = ({
    sessionPassword,
    onMsg,
    account,
    keyStore,
    state,
    dApp,
    request,
    network,
    networkMap,
    networkRPCMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    portfolio,
    actionSource,
}: Props) => {
    switch (keyStore.type) {
        case 'track_only':
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
            return (
                <Signing
                    installationId={installationId}
                    account={account}
                    dApp={dApp}
                    keyStore={keyStore}
                    network={network}
                    networkMap={networkMap}
                    request={request}
                    sessionPassword={sessionPassword}
                    state={state}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'safe_4337':
            return network.isSafeSupported ? (
                <CheckSafe4337Deployment
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStoreMap={keyStoreMap}
                    portfolio={portfolio}
                    account={account}
                    dApp={dApp}
                    keyStore={keyStore}
                    network={network}
                    networkMap={networkMap}
                    request={request}
                    sessionPassword={sessionPassword}
                    state={state}
                    networkRPCMap={networkRPCMap}
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

        default:
            return notReachable(keyStore)
    }
}
