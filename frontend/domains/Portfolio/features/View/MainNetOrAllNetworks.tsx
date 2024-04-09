import React, { useState } from 'react'

import { Column } from '@zeal/uikit/Column'

import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { useIsFeatureEnabled } from '@zeal/domains/ABTest'
import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { Widget as AppWidget } from '@zeal/domains/App/components/Widget'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { DepositMonitorWidget } from '@zeal/domains/Currency/domains/BankTransfer/features/DepositMonitorWidget'
import { KYCStatusWidget } from '@zeal/domains/Currency/domains/BankTransfer/features/KYCStatusWidget'
import { WithdrawalMonitorWidget } from '@zeal/domains/Currency/domains/BankTransfer/features/WithdrawalMonitorWidget'
import {
    BridgeSubmitted,
    SubmitedBridgesMap,
} from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from '@zeal/domains/Currency/features/BridgeWidget'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Widget as NFTWidget } from '@zeal/domains/NFTCollection/components/Widget'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Widget as TokenWidget } from '@zeal/domains/Token/components/Widget'
import { Submited } from '@zeal/domains/TransactionRequest'
import { List as TransactionRequestList } from '@zeal/domains/TransactionRequest/features/List'

import { LastRefreshed } from './LastRefreshed'
import { NextBestActionWidget } from './NextBestActionWidget'
import { QuickActionsWidget } from './QuickActionsWidget'

export type Msg =
    | MsgOf<typeof AppWidget>
    | MsgOf<typeof BridgeWidget>
    | MsgOf<typeof DepositMonitorWidget>
    | MsgOf<typeof KYCStatusWidget>
    | MsgOf<typeof NFTWidget>
    | MsgOf<typeof TokenWidget>
    | MsgOf<typeof TransactionRequestList>
    | MsgOf<typeof WithdrawalMonitorWidget>
    | MsgOf<typeof NextBestActionWidget>
    | Extract<
          MsgOf<typeof QuickActionsWidget>,
          {
              type:
                  | 'on_add_funds_click'
                  | 'on_send_clicked'
                  | 'on_bank_clicked'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
          }
      >
    | { type: 'on_recovery_kit_setup'; address: Address }
    | { type: 'reload_button_click' }

type Props = {
    keystore: KeyStore
    account: Account
    portfolio: Portfolio
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    fetchedAt: Date
    currentNetwork: CurrentNetwork
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

export const MainNetOrAllNetworks = ({
    submitedBridgesMap,
    transactionRequests,
    submittedOffRampTransactions,
    account,
    onMsg,
    accountsMap,
    keyStoreMap,
    keystore,
    portfolio,
    fetchedAt,
    networkMap,
    currentNetwork,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    userMadeActionOnNextBestActionIds,
    installationId,
}: Props) => {
    const [cachedTransactionRequests] = useState<Submited[]>(
        transactionRequests[account.address] || []
    )
    const [bridges] = useState<BridgeSubmitted[]>(
        submitedBridgesMap[account.address] || []
    )
    const [pendingOfframpTransactions] = useState<
        SubmittedOfframpTransaction[]
    >(submittedOffRampTransactions)

    const isNbaEnabled = useIsFeatureEnabled(installationId, 'nbas')

    return (
        <Column spacing={8}>
            <QuickActionsWidget
                onMsg={onMsg}
                address={account.address}
                installationId={installationId}
            />
            {isNbaEnabled &&
                ZealPlatform.OS === 'web' &&
                bridges.length === 0 &&
                cachedTransactionRequests.length === 0 &&
                pendingOfframpTransactions.length === 0 && (
                    <NextBestActionWidget
                        installationId={installationId}
                        account={account}
                        userMadeActionOnNextBestActionIds={
                            userMadeActionOnNextBestActionIds
                        }
                        onMsg={onMsg}
                        keystore={keystore}
                    />
                )}
            <Column spacing={16}>
                {bridges.length > 0 && (
                    <Column spacing={12}>
                        {bridges.map((bridge) => (
                            <BridgeWidget
                                key={bridge.sourceTransactionHash}
                                bridgeSubmitted={bridge}
                                onMsg={onMsg}
                            />
                        ))}
                    </Column>
                )}

                {cachedTransactionRequests.length > 0 && (
                    <TransactionRequestList
                        accountsMap={accountsMap}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        transactionRequests={cachedTransactionRequests}
                        onMsg={onMsg}
                    />
                )}

                <KYCStatusWidget
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />

                <DepositMonitorWidget
                    bankTransferInfo={bankTransferInfo}
                    networkMap={networkMap}
                    onMsg={onMsg}
                />

                {pendingOfframpTransactions.length > 0 && (
                    <Column spacing={12}>
                        {pendingOfframpTransactions.map(
                            (submittedTransaction) => (
                                <WithdrawalMonitorWidget
                                    key={submittedTransaction.transactionHash}
                                    bankTransferInfo={bankTransferInfo}
                                    submittedTransaction={submittedTransaction}
                                    networkMap={networkMap}
                                    onMsg={onMsg}
                                />
                            )
                        )}
                    </Column>
                )}

                <TokenWidget
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    currentNetwork={currentNetwork}
                    tokens={portfolio.tokens}
                    knownCurrencies={portfolio.currencies}
                    onMsg={onMsg}
                />
                <AppWidget
                    networkMap={networkMap}
                    apps={portfolio.apps}
                    currencies={portfolio.currencies}
                    onMsg={onMsg}
                />
                <NFTWidget
                    nftCollections={portfolio.nftCollections}
                    currencies={portfolio.currencies}
                    onMsg={onMsg}
                />

                <LastRefreshed
                    fetchedAt={fetchedAt}
                    onClick={() => onMsg({ type: 'reload_button_click' })}
                />
            </Column>
        </Column>
    )
}
