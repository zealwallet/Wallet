import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { getAllNetworksFromNetworkMap } from '@zeal/domains/Network/helpers/getAllNetworksFromNetworkMap'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { DetailsView } from '@zeal/domains/NFTCollection/components/DetailsView'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    state: State
    account: Account
    installationId: string
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keystoreMap: KeyStoreMap
    selectedNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    portfolioMap: PortfolioMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof DetailsView>
    | MsgOf<typeof NetworkFilter>

export type State =
    | { type: 'closed' }
    | { type: 'network_filter' }
    | {
          type: 'nft_detailed_view'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }

export const Modal = ({
    state,
    knownCurrencies,
    installationId,
    account,
    networkMap,
    networkRPCMap,
    keystoreMap,
    selectedNetwork,
    currencyHiddenMap,
    portfolioMap,
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
                        knownCurrencies={knownCurrencies}
                    />
                </UIModal>
            )
        case 'network_filter':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        networks={getAllNetworksFromNetworkMap(networkMap)}
                        networkRPCMap={networkRPCMap}
                        portfolio={getPortfolio({
                            address: account.address,
                            portfolioMap,
                        })}
                        currentNetwork={selectedNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
