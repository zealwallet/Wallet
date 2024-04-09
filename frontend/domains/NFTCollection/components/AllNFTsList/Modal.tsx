import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { DetailsView } from '@zeal/domains/NFTCollection/components/DetailsView'

type Props = {
    state: State
    account: Account
    installationId: string
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof DetailsView>

export type State =
    | { type: 'closed' }
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

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
