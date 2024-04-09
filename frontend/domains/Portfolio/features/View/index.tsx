import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from '@zeal/domains/Currency/features/BridgeWidget'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'

import { MainNetOrAllNetworks } from './MainNetOrAllNetworks'
import { TestNetworkView } from './TestNetworkView'

type Props = {
    keystore: KeyStore
    account: Account
    portfolio: Portfolio
    fetchedAt: Date
    accountsMap: AccountsMap
    currentNetwork: CurrentNetwork
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    userMadeActionOnNextBestActionIds: string[]
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'reload_button_click' }
    | { type: 'on_recovery_kit_setup'; address: Address }
    | MsgOf<typeof TestNetworkView>
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof MainNetOrAllNetworks>

export const View = ({
    portfolio,
    fetchedAt,
    keystore,
    account,
    currentNetwork,
    keyStoreMap,
    submitedBridgesMap,
    accountsMap,
    transactionRequests,
    submittedOffRampTransactions,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    userMadeActionOnNextBestActionIds,
    installationId,
    onMsg,
}: Props) => {
    switch (currentNetwork.type) {
        case 'all_networks':
            return (
                <MainNetOrAllNetworks
                    installationId={installationId}
                    userMadeActionOnNextBestActionIds={
                        userMadeActionOnNextBestActionIds
                    }
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    bankTransferInfo={bankTransferInfo}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    networkMap={networkMap}
                    currentNetwork={currentNetwork}
                    networkRPCMap={networkRPCMap}
                    onMsg={onMsg}
                    account={account}
                    portfolio={portfolio}
                    keystore={keystore}
                    fetchedAt={fetchedAt}
                    submitedBridgesMap={submitedBridgesMap}
                    submittedOffRampTransactions={submittedOffRampTransactions}
                    transactionRequests={transactionRequests}
                />
            )
        case 'specific_network':
            switch (currentNetwork.network.type) {
                case 'predefined':
                    return (
                        <MainNetOrAllNetworks
                            installationId={installationId}
                            userMadeActionOnNextBestActionIds={
                                userMadeActionOnNextBestActionIds
                            }
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            bankTransferInfo={bankTransferInfo}
                            accountsMap={accountsMap}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            currentNetwork={currentNetwork}
                            networkRPCMap={networkRPCMap}
                            onMsg={onMsg}
                            account={account}
                            portfolio={portfolio}
                            keystore={keystore}
                            fetchedAt={fetchedAt}
                            submitedBridgesMap={submitedBridgesMap}
                            submittedOffRampTransactions={
                                submittedOffRampTransactions
                            }
                            transactionRequests={transactionRequests}
                        />
                    )
                case 'custom':
                case 'testnet':
                    return (
                        <TestNetworkView
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            networkMap={networkMap}
                            network={currentNetwork.network}
                            networkRPCMap={networkRPCMap}
                            fetchedAt={fetchedAt}
                            knownCurrencies={portfolio.currencies}
                            tokens={portfolio.tokens}
                            onMsg={onMsg}
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
