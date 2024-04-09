import { FormattedMessage } from 'react-intl'
import { ScrollView } from 'react-native'

import { Column } from '@zeal/uikit/Column'
import { CircleMore } from '@zeal/uikit/Icon/CircleMore'
import { Screen } from '@zeal/uikit/Screen'
import { Toast, ToastContainer, ToastText } from '@zeal/uikit/Toast'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Widget } from '@zeal/domains/Account/components/Widget'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { BridgeWidget } from '@zeal/domains/Currency/features/BridgeWidget'
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
    isLoading: boolean
    keystore: KeyStore
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    userMadeActionOnNextBestActionIds: string[]
    installationId: string
    mode: Mode
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ActionBar>
    | MsgOf<typeof Widget>
    | ViewPortfolioMsg
    | MsgOf<typeof BridgeWidget>

const getScreenPadding = (
    mode: Mode
): React.ComponentProps<typeof Screen>['padding'] => {
    switch (mode) {
        case 'fullscreen':
            return 'form'
        case 'popup':
            return 'extension_connection_manager'
        default:
            return notReachable(mode)
    }
}

export const Layout = ({
    account,
    currentNetwork,
    portfolio,
    accountsMap,
    fetchedAt,
    keyStoreMap,
    isLoading,
    keystore,
    submitedBridgesMap,
    transactionRequests,
    submittedOffRampTransactions,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    userMadeActionOnNextBestActionIds,
    installationId,
    mode,
    onMsg,
}: Props) => {
    return (
        <Screen padding={getScreenPadding(mode)} background="light">
            <Column spacing={8} shrink fill>
                <Column spacing={8}>
                    <ActionBar
                        installationId={installationId}
                        mode={mode}
                        networkMap={networkMap}
                        onMsg={onMsg}
                    />

                    <Widget
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        keystore={keystore}
                        currentNetwork={currentNetwork}
                        portfolio={portfolio}
                        currentAccount={account}
                        onMsg={onMsg}
                    />
                </Column>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ViewPortfolio
                        installationId={installationId}
                        userMadeActionOnNextBestActionIds={
                            userMadeActionOnNextBestActionIds
                        }
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
                        keystore={keystore}
                        fetchedAt={fetchedAt}
                        portfolio={portfolio}
                        bankTransferInfo={bankTransferInfo}
                        submittedOffRampTransactions={
                            submittedOffRampTransactions
                        }
                        onMsg={onMsg}
                    />
                </ScrollView>
            </Column>

            {isLoading && (
                <ToastContainer>
                    <Toast>
                        <CircleMore size={18} color="iconAccent2" />
                        <ToastText>
                            <FormattedMessage
                                id="accounts.view.reLoading.title"
                                defaultMessage="Loading assets..."
                            />
                        </ToastText>
                    </Toast>
                </ToastContainer>
            )}
        </Screen>
    )
}
