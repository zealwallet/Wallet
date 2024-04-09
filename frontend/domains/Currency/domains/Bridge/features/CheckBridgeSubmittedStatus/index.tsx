import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'

import { Completed } from './Completed'
import { CompletedSplash } from './CompletedSplash'
import { Pending } from './Pending'

type Props = {
    account: Account
    keystoreMap: KeyStoreMap
    bridgeSubmitted: BridgeSubmitted
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'pending' }
    | { type: 'completed_splash' }
    | { type: 'competed' }

export type Msg =
    | { type: 'close' }
    | { type: 'bridge_completed'; bridgeSubmitted: BridgeSubmitted }

export const CheckBridgeSubmittedStatus = ({
    account,
    bridgeSubmitted,
    keystoreMap,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'pending' })
    switch (state.type) {
        case 'pending':
            return (
                <Pending
                    networkMap={networkMap}
                    account={account}
                    keystoreMap={keystoreMap}
                    bridgeSubmitted={bridgeSubmitted}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'bridge_completed':
                                setState({ type: 'completed_splash' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'completed_splash':
            return (
                <CompletedSplash
                    account={account}
                    keystoreMap={keystoreMap}
                    bridgeSubmitted={bridgeSubmitted}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'splash_screen_completed':
                                setState({ type: 'competed' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'competed':
            return (
                <Completed
                    networkMap={networkMap}
                    keystoreMap={keystoreMap}
                    account={account}
                    bridgeSubmitted={bridgeSubmitted}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({
                                    type: 'bridge_completed',
                                    bridgeSubmitted,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
