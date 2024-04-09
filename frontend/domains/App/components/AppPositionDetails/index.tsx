import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { Modal, State } from './Modal'

export type Props = {
    account: Account
    keystore: KeyStore
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    app: App
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const AppPositionDetails = ({
    account,
    keystore,
    knownCurrencies,
    networkMap,
    app,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'closed' })

    return (
        <>
            <Layout
                account={account}
                keystore={keystore}
                knownCurrencies={knownCurrencies}
                networkMap={networkMap}
                app={app}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_health_rate_info_click':
                            setState({
                                type: 'health_rate_info',
                                protocol: msg.protocol,
                            })
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
            <Modal
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        default:
                            notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
