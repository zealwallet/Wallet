import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    apps: App[]
    account: Account
    currincies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    keystore: KeyStore
    installationId: string
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = Extract<
    MsgOf<typeof Layout>,
    { type: 'close' | 'account_filter_click' | 'network_filter_click' }
>

export const AppsList = ({
    apps,
    account,
    selectedNetwork,
    keystore,
    currincies,
    networkMap,
    installationId,
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
                currincies={currincies}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'network_filter_click':
                        case 'account_filter_click':
                            onMsg(msg)
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
                knownCurrencies={currincies}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
