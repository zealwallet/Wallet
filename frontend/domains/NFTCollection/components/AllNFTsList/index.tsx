import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State } from './Modal'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    account: Account
    installationId: string

    networkMap: NetworkMap
    currencies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    portfolio: Portfolio
    portfolioMap: PortfolioMap
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    networkRPCMap: NetworkRPCMap
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<MsgOf<typeof Layout>, { type: 'account_filter_click' }>
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_profile_change_confirm_click'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_send_nft_click'
                  | 'on_network_item_click'
                  | 'on_select_rpc_click'
                  | 'on_rpc_change_confirmed'
          }
      >

export const AllNFTsList = ({
    nftCollections,
    selectedNetwork,
    account,
    currencies,
    portfolio,
    keystore,
    networkMap,
    currencyHiddenMap,
    installationId,
    networkRPCMap,
    keystoreMap,
    portfolioMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })
    useEffect(() => {
        postUserEvent({
            type: 'NFTListEnteredEvent',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Layout
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                keystore={keystore}
                portfolio={portfolio}
                nftCollections={nftCollections}
                account={account}
                currincies={currencies}
                selectedNetwork={selectedNetwork}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_nft_click':
                            setState({
                                type: 'nft_detailed_view',
                                nft: msg.nft,
                                nftCollection: msg.nftCollection,
                            })
                            break
                        case 'close':
                        case 'account_filter_click':
                            onMsg(msg)
                            break
                        case 'network_filter_click':
                            setState({
                                type: 'network_filter',
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                networkMap={networkMap}
                state={state}
                account={account}
                knownCurrencies={currencies}
                networkRPCMap={networkRPCMap}
                keystoreMap={keystoreMap}
                selectedNetwork={selectedNetwork}
                currencyHiddenMap={currencyHiddenMap}
                portfolioMap={portfolioMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'on_profile_change_confirm_click':
                        case 'on_send_nft_click':
                        case 'on_select_rpc_click':
                        case 'on_rpc_change_confirmed':
                            onMsg(msg)
                            break
                        case 'on_network_item_click':
                            setState({ type: 'closed' })
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
