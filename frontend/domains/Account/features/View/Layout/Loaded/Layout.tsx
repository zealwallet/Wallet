import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Widget } from '@zeal/domains/Account/components/Widget'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from '@zeal/domains/Currency/features/BridgeWidget'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import {
    Msg as ViewPortfolioMsg,
    View as ViewPortfolio,
} from '@zeal/domains/Portfolio/features/View'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'

import { ActionBar } from '../ActionBar'

type Props = {
    account: Account
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    portfolio: Portfolio
    accountsMap: AccountsMap
    currentNetwork: CurrentNetwork
    fetchedAt: Date
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keystore: KeyStore
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    installationId: string
    mode: Mode
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ActionBar>
    | MsgOf<typeof Widget>
    | ViewPortfolioMsg
    | MsgOf<typeof BridgeWidget>

export const Layout = ({
    account,
    currentNetwork,
    portfolio,
    accountsMap,
    fetchedAt,
    keyStoreMap,
    walletConnectInstanceLoadable,
    keystore,
    submitedBridgesMap,
    transactionRequests,
    submittedOffRampTransactions,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    mode,
    onMsg,
}: Props) => {
    return (
        <>
            <ActionBar
                installationId={installationId}
                mode={mode}
                networkMap={networkMap}
                onMsg={onMsg}
            />
            <Widget
                walletConnectInstanceLoadable={walletConnectInstanceLoadable}
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                keystore={keystore}
                currentNetwork={currentNetwork}
                portfolio={portfolio}
                currentAccount={account}
                onMsg={onMsg}
            />
            <ViewPortfolio
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                keyStoreMap={keyStoreMap}
                accountsMap={accountsMap}
                networkMap={networkMap}
                submitedBridgesMap={submitedBridgesMap}
                transactionRequests={transactionRequests}
                currentNetwork={currentNetwork}
                networkRPCMap={networkRPCMap}
                account={account}
                fetchedAt={fetchedAt}
                portfolio={portfolio}
                bankTransferInfo={bankTransferInfo}
                submittedOffRampTransactions={submittedOffRampTransactions}
                onMsg={onMsg}
            />
        </>
    )
}
