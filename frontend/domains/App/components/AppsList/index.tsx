import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { App } from '@zeal/domains/App'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    apps: App[]
    account: Account
    currencies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    keystore: KeyStore
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keystoreMap: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    portfolioMap: PortfolioMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' | 'account_filter_click' }>
    | MsgOf<typeof Modal>

export const AppsList = ({
    apps,
    account,
    selectedNetwork,
    keystore,
    currencies,
    networkMap,
    installationId,
    networkRPCMap,
    keystoreMap,
    currencyHiddenMap,
    portfolioMap,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                installationId={installationId}
                apps={apps}
                account={account}
                selectedNetwork={selectedNetwork}
                currincies={currencies}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'account_filter_click':
                            onMsg(msg)
                            break
                        case 'network_filter_click':
                            setModalState({
                                type: 'network_filter',
                            })
                            break
                        case 'on_app_position_click':
                            setModalState({
                                type: 'app_position_details',
                                app: msg.app,
                            })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                account={account}
                keystore={keystore}
                state={modalState}
                knownCurrencies={currencies}
                networkMap={networkMap}
                installationId={installationId}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                keystoreMap={keystoreMap}
                currencyHiddenMap={currencyHiddenMap}
                portfolioMap={portfolioMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break
                        case 'on_select_rpc_click':
                        case 'on_rpc_change_confirmed':
                            onMsg(msg)
                            break
                        case 'on_network_item_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
