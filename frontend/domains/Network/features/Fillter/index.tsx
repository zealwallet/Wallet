import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    portfolio: Portfolio | null

    account: Account
    keyStoreMap: KeyStoreMap
    installationId: string

    networks: CurrentNetwork[]
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' | 'on_network_item_click' }>
    | Extract<
          MsgOf<typeof Modal>,
          { type: 'on_rpc_change_confirmed' | 'on_select_rpc_click' }
      >

export const NetworkFilter = ({
    account,
    currentNetwork,
    keyStoreMap,
    networks,
    portfolio,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    installationId,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    useEffect(() => {
        postUserEvent({
            type: 'FilterFlowEnteredEvent',
            installationId,
        })
    }, [installationId])

    return (
        <>
            <Layout
                networkMap={networkMap}
                currencyHiddenMap={currencyHiddenMap}
                portfolio={portfolio}
                account={account}
                currentNetwork={currentNetwork}
                keyStore={getKeyStore({
                    address: account.address,
                    keyStoreMap,
                })}
                networks={networks}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_network_item_click':
                            postUserEvent({
                                type: 'FilterAppliedEvent',
                                installationId,
                            })
                            onMsg(msg)
                            break

                        case 'on_add_network_click':
                            setModalState({ type: 'add_network_tips' })
                            break

                        case 'on_edit_network_details_click':
                            setModalState({
                                type: 'edit_network_details',
                                network: msg.network,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                networkRPCMap={networkRPCMap}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_rpc_change_confirmed':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_select_rpc_click':
                            setModalState({ type: 'closed' })
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
