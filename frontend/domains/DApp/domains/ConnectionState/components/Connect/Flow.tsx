import { useEffect, useState } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { keys } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

import { Connect } from './Connect'
import { HowToConnectToMetaMaskStory } from './HowToConnectToMetaMaskStory'

import {
    ConnectedToMetaMask,
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from '../..'

type Props = {
    connectionState:
        | DisconnectedState
        | NotInteractedState
        | ConnectedToMetaMask
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    dApps: Record<string, DAppConnectionState>
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Connect>
    | { type: 'on_how_to_connect_to_meta_mask_story_show' }
    | { type: 'on_how_to_connect_to_meta_mask_story_closed' }

type State = { type: 'show_story' } | { type: 'show_connection' }

const calculateState = (
    dApps: Record<string, DAppConnectionState>,
    alternativeProvider: AlternativeProvider
): State => {
    switch (alternativeProvider) {
        case 'metamask':
            if (keys(dApps).length === 0) {
                return {
                    type: 'show_story',
                }
            } else {
                return {
                    type: 'show_connection',
                }
            }

        case 'provider_unavailable':
            return {
                type: 'show_connection',
            }

        default:
            return notReachable(alternativeProvider)
    }
}

export const Flow = ({
    initialAccount,
    accounts,
    portfolioMap,
    keystores,
    connectionState,
    requestedNetwork,
    networkRPCMap,
    customCurrencyMap,
    sessionPassword,
    networkMap,
    currencyHiddenMap,
    alternativeProvider,
    installationId,
    dApps,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        calculateState(dApps, alternativeProvider)
    )

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'show_story':
                liveOnMsg.current({
                    type: 'on_how_to_connect_to_meta_mask_story_show',
                })
                break

            case 'show_connection':
                liveOnMsg.current({
                    type: 'on_how_to_connect_to_meta_mask_story_closed',
                })
                break

            default:
                notReachable(state)
        }
    }, [state, liveOnMsg])

    switch (state.type) {
        case 'show_story':
            return (
                <HowToConnectToMetaMaskStory
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_how_to_connect_to_metamask_completed':
                            case 'on_stories_dismissed':
                                setState({ type: 'show_connection' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'show_connection':
            return (
                <Connect
                    installationId={installationId}
                    initialAccount={initialAccount}
                    accounts={accounts}
                    portfolioMap={portfolioMap}
                    keystores={keystores}
                    requestedNetwork={requestedNetwork}
                    customCurrencyMap={customCurrencyMap}
                    connectionState={connectionState}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    networkMap={networkMap}
                    currencyHiddenMap={currencyHiddenMap}
                    onMsg={onMsg}
                    alternativeProvider={alternativeProvider}
                />
            )

        default:
            return notReachable(state)
    }
}
