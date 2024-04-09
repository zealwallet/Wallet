import { useEffect } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendSafe4337Transaction } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { SendRegularTransaction } from './SendRegularTransaction'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    portfolio: Portfolio | null
    sendTransactionRequest: EthSendTransaction

    account: Account
    dApp: DAppSiteInfo | null

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    source: components['schemas']['TransactionEventSource']

    fetchSimulationByRequest: ({
        network,
        rpcRequest,
        dApp,
    }: {
        network: Network
        rpcRequest: EthSendTransaction
        dApp: DAppSiteInfo | null
    }) => Promise<SimulationResult>

    state: State
    actionSource: ActionSource

    onMsg: (msg: Msg) => void
}

export type State = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | MsgOf<typeof SendSafe4337Transaction>
    | MsgOf<typeof SendRegularTransaction>

export const SendTransaction = ({
    portfolio,
    network,
    networkRPCMap,
    sessionPassword,
    account,
    accounts,
    dApp,
    feePresetMap,
    gasCurrencyPresetMap,
    fetchSimulationByRequest,
    installationId,
    keystores,
    networkMap,
    sendTransactionRequest,
    source,
    state,
    actionSource,
    onMsg,
}: Props) => {
    const keyStore = getKeyStore({
        address: account.address,
        keyStoreMap: keystores,
    })
    const keyStoreLive = useLiveRef(keyStore)

    useEffect(() => {
        postUserEvent({
            type: 'TransactionRequestedEvent',
            installationId,
            keystoreType: keystoreToUserEventType(keyStoreLive.current),
            network: network.hexChainId,
            source,
            keystoreId: keyStoreLive.current.id,
        })
    }, [installationId, keyStoreLive, network.hexChainId, source])

    switch (keyStore.type) {
        case 'safe_4337':
            return (
                <SendSafe4337Transaction
                    installationId={installationId}
                    source={source}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    state={state}
                    accountsMap={accounts}
                    keyStoreMap={keystores}
                    networkMap={networkMap}
                    account={account}
                    dAppInfo={dApp}
                    keyStore={keyStore}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    portfolio={portfolio}
                    rpcRequestToBundle={sendTransactionRequest}
                    sessionPassword={sessionPassword}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'track_only':
            return (
                <SendRegularTransaction
                    account={account}
                    accounts={accounts}
                    dApp={dApp}
                    feePresetMap={feePresetMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    keystores={keystores}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    sendTransactionRequest={sendTransactionRequest}
                    sessionPassword={sessionPassword}
                    source={source}
                    state={state}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(keyStore)
    }
}
