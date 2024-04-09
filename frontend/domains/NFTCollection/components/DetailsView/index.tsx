import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State } from './Modal'

type Props = {
    account: Account
    installationId: string

    nft: PortfolioNFT
    nftCollection: PortfolioNFTCollection
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_profile_change_confirm_click'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
          }
      >
    | Extract<MsgOf<typeof Layout>, { type: 'on_send_nft_click' }>

export const DetailsView = ({
    nft,
    nftCollection,
    knownCurrencies,
    account,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })

    return (
        <>
            <Layout
                networkMap={networkMap}
                account={account}
                nft={nft}
                nftCollection={nftCollection}
                knownCurrencies={knownCurrencies}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_send_nft_click':
                            onMsg(msg)
                            postUserEvent({
                                type: 'SendFlowEnteredEvent',
                                location: 'nft_view',
                                installationId,
                                asset: 'nft',
                            })
                            break
                        case 'on_info_button_click':
                            setState({ type: 'pricing_modal' })
                            break
                        case 'on_change_account_icon_click':
                            setState({
                                type: 'confirm_account_profile_picture_change',
                                src: msg.src,
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                account={account}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_profile_change_confirm_click':
                            setState({ type: 'closed' })
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
