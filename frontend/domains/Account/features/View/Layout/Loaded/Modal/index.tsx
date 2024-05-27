import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { AddFunds } from '@zeal/domains/Account/components/AddFunds'
import { App } from '@zeal/domains/App'
import { AppPositionDetails } from '@zeal/domains/App/components/AppPositionDetails'
import { AppsList } from '@zeal/domains/App/components/AppsList'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { AllNFTsList } from '@zeal/domains/NFTCollection/components/AllNFTsList'
import { DetailsView } from '@zeal/domains/NFTCollection/components/DetailsView'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { TokenList } from '@zeal/domains/Token/components/TokenList'

type Props = {
    state: State
    account: Account
    currentNetwork: CurrentNetwork
    portfolio: Portfolio
    portfolioMap: PortfolioMap
    keystore: KeyStore
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    installationId: string
    keystoreMap: KeyStoreMap
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof TokenList>
    | MsgOf<typeof DetailsView>
    | MsgOf<typeof AddFunds>
    | MsgOf<typeof AppsList>

export type State =
    | { type: 'closed' }
    | { type: 'show_all_tokens' }
    | { type: 'show_all_apps' }
    | { type: 'show_all_nfts' }
    | {
          type: 'nft_detailed_view'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }
    | { type: 'add_funds' }
    | { type: 'app_position'; app: App }

export const Modal = ({
    state,
    account,
    currentNetwork,
    portfolio,
    portfolioMap,
    keystore,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    keystoreMap,
    customCurrencyMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'nft_detailed_view':
            return (
                <UIModal>
                    <DetailsView
                        installationId={installationId}
                        networkMap={networkMap}
                        account={account}
                        onMsg={onMsg}
                        nft={state.nft}
                        nftCollection={state.nftCollection}
                        knownCurrencies={portfolio.currencies}
                    />
                </UIModal>
            )
        case 'show_all_nfts':
            return (
                <UIModal>
                    <AllNFTsList
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        keystore={keystore}
                        portfolio={portfolio}
                        portfolioMap={portfolioMap}
                        nftCollections={portfolio.nftCollections}
                        account={account}
                        currencies={portfolio.currencies}
                        selectedNetwork={currentNetwork}
                        networkRPCMap={networkRPCMap}
                        keystoreMap={keystoreMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'show_all_apps':
            return (
                <UIModal>
                    <AppsList
                        networkRPCMap={networkRPCMap}
                        keystoreMap={keystoreMap}
                        currencyHiddenMap={currencyHiddenMap}
                        portfolioMap={portfolioMap}
                        installationId={installationId}
                        networkMap={networkMap}
                        keystore={keystore}
                        apps={portfolio.apps}
                        currencies={portfolio.currencies}
                        account={account}
                        selectedNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'show_all_tokens':
            return (
                <UIModal>
                    <TokenList
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencyMap={customCurrencyMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        portfolioMap={portfolioMap}
                        portfolio={portfolio}
                        account={account}
                        currentNetwork={currentNetwork}
                        keystoreMap={keystoreMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_funds':
            return (
                <UIModal>
                    <AddFunds
                        installationId={installationId}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'app_position':
            return (
                <UIModal>
                    <AppPositionDetails
                        account={account}
                        keystore={keystore}
                        networkMap={networkMap}
                        knownCurrencies={portfolio.currencies}
                        app={state.app}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
