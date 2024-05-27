import { useState } from 'react'

import { Column } from '@zeal/uikit/Column'
import { RefreshContainer } from '@zeal/uikit/RefreshContainer'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { sortCurrencyByPinStatus } from '@zeal/domains/Currency/helpers/sortCurrencyByPinStatus'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Mode } from '@zeal/domains/Main'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { filterPortfolioByNetwork } from '@zeal/domains/Portfolio/helpers/filterPortfolioByNetwork'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'

import { Error as ErrorView, Msg as ErrorMsg } from './Error'
import { Loaded, Msg as LoadedMsg } from './Loaded'
import { Loading } from './Loading'

type Props = {
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    account: Account
    accountsMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    portfolioMap: PortfolioMap
    selectedNetwork: CurrentNetwork
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    customCurrencyMap: CustomCurrencyMap
    currencyPinMap: CurrencyPinMap
    installationId: string
    mode: Mode
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}

export type Msg = LoadedMsg | ErrorMsg | { type: 'on_refresh_pulled' }

const getScreenPadding = (
    mode: Mode
): React.ComponentProps<typeof Screen>['padding'] => {
    switch (mode) {
        case 'fullscreen':
            return 'controller_tabs_fullscreen_scroll'
        case 'popup':
            return 'controller_tabs_popup'
        default:
            return notReachable(mode)
    }
}

export const Layout = ({
    account,
    portfolioLoadable,
    portfolioMap,
    selectedNetwork,
    keystoreMap,
    accountsMap,
    submitedBridgesMap,
    submittedOffRampTransactions,
    transactionRequests,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    customCurrencyMap,
    currencyPinMap,
    installationId,
    walletConnectInstanceLoadable,
    mode,
    onMsg,
}: Props) => {
    const [refreshPulled, setRefreshPulled] = useState(false)

    const keystore = getKeyStore({
        keyStoreMap: keystoreMap,
        address: account.address,
    })

    return (
        <Screen
            padding={getScreenPadding(mode)}
            background="light"
            onNavigateBack={null}
        >
            <Column spacing={0} shrink fill>
                <RefreshContainer
                    onRefreshPulled={() => {
                        setRefreshPulled(true)
                        onMsg({ type: 'on_refresh_pulled' })
                    }}
                    isRefreshing={(() => {
                        switch (portfolioLoadable.type) {
                            case 'reloading':
                                return refreshPulled
                            case 'loaded':
                            case 'subsequent_failed':
                            case 'error':
                            case 'loading':
                                return false
                            /* istanbul ignore next */
                            default:
                                return notReachable(portfolioLoadable)
                        }
                    })()}
                >
                    {(() => {
                        switch (portfolioLoadable.type) {
                            case 'loading':
                                return (
                                    <Loading
                                        walletConnectInstanceLoadable={
                                            walletConnectInstanceLoadable
                                        }
                                        mode={mode}
                                        networkMap={networkMap}
                                        installationId={installationId}
                                        keystore={keystore}
                                        account={account}
                                        currentNetwork={selectedNetwork}
                                        onMsg={onMsg}
                                    />
                                )
                            case 'loaded':
                            case 'reloading':
                            case 'subsequent_failed':
                                const portfolio = filterPortfolioByNetwork(
                                    portfolioLoadable.data.portfolio,
                                    selectedNetwork,
                                    networkMap
                                )

                                portfolio.tokens.sort((a, b) =>
                                    sortCurrencyByPinStatus(currencyPinMap)(
                                        portfolio.currencies[
                                            a.balance.currencyId
                                        ],
                                        portfolio.currencies[
                                            b.balance.currencyId
                                        ]
                                    )
                                )

                                return (
                                    <Loaded
                                        mode={mode}
                                        installationId={installationId}
                                        submittedOffRampTransactions={
                                            submittedOffRampTransactions
                                        }
                                        currencyHiddenMap={currencyHiddenMap}
                                        customCurrencyMap={customCurrencyMap}
                                        currencyPinMap={currencyPinMap}
                                        bankTransferInfo={bankTransferInfo}
                                        accountsMap={accountsMap}
                                        networkMap={networkMap}
                                        submitedBridgesMap={submitedBridgesMap}
                                        transactionRequests={
                                            transactionRequests
                                        }
                                        keystoreMap={keystoreMap}
                                        fetchedAt={
                                            portfolioLoadable.data.fetchedAt
                                        }
                                        walletConnectInstanceLoadable={
                                            walletConnectInstanceLoadable
                                        }
                                        portfolio={portfolio}
                                        portfolioMap={portfolioMap}
                                        account={account}
                                        currentNetwork={selectedNetwork}
                                        networkRPCMap={networkRPCMap}
                                        onMsg={onMsg}
                                    />
                                )
                            case 'error':
                                return (
                                    <ErrorView
                                        walletConnectInstanceLoadable={
                                            walletConnectInstanceLoadable
                                        }
                                        mode={mode}
                                        networkMap={networkMap}
                                        installationId={installationId}
                                        keystore={keystore}
                                        account={account}
                                        currentNetwork={selectedNetwork}
                                        onMsg={onMsg}
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(portfolioLoadable)
                        }
                    })()}
                </RefreshContainer>
            </Column>
        </Screen>
    )
}
