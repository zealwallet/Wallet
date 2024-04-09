import React, { useEffect, useState } from 'react'

import { DragAndDropBar } from '@zeal/uikit/DragAndClickHandler'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ConnectedToMetaMask } from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

import { Expanded } from './Expanded'
import { Minimize } from './Minimize'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null
    connectionState: ConnectedToMetaMask
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    dApps: Record<string, DAppConnectionState>
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'expanded' | 'minimized' }
    | Extract<MsgOf<typeof Minimize>, { type: 'drag' }>
    | Extract<
          MsgOf<typeof Expanded>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'dApp_info_loaded'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'session_password_decrypted'
                  | 'zeal_account_connected'
                  | 'on_how_to_connect_to_meta_mask_story_show'
                  | 'on_how_to_connect_to_meta_mask_story_closed'
                  | 'safe_wallet_clicked'
                  | 'on_zeal_account_connection_request'
          }
      >

export type State = { type: 'minimised' } | { type: 'expanded' }

export const MinizedExpanded = ({
    initialAccount,
    connectionState,
    portfolioMap,
    accounts,
    keystores,
    currencyHiddenMap,
    networkMap,
    customCurrencyMap,
    networkRPCMap,
    requestedNetwork,
    sessionPassword,
    encryptedPassword,
    alternativeProvider,
    dApps,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'minimised' })

    const liveMsg = useLiveRef(onMsg)
    useEffect(() => {
        switch (state.type) {
            case 'minimised':
                liveMsg.current({ type: 'minimized' })
                break
            case 'expanded':
                liveMsg.current({ type: 'expanded' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    switch (state.type) {
        case 'minimised':
            return (
                <Minimize
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                                setState({ type: 'expanded' })
                                break
                            case 'drag':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'expanded':
            return (
                <>
                    <DragAndDropBar onMsg={onMsg} />
                    <Expanded
                        installationId={installationId}
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolioMap={portfolioMap}
                        keystores={keystores}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        connectionState={connectionState}
                        initialAccount={initialAccount}
                        requestedNetwork={requestedNetwork}
                        encryptedPassword={encryptedPassword}
                        alternativeProvider={alternativeProvider}
                        dApps={dApps}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'add_wallet_clicked':
                                case 'hardware_wallet_clicked':
                                case 'on_account_create_request':
                                case 'track_wallet_clicked':
                                case 'dApp_info_loaded':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                case 'session_password_decrypted':
                                case 'zeal_account_connected':
                                case 'on_how_to_connect_to_meta_mask_story_show':
                                case 'on_how_to_connect_to_meta_mask_story_closed':
                                case 'safe_wallet_clicked':
                                case 'on_zeal_account_connection_request':
                                    onMsg(msg)
                                    break

                                case 'lock_screen_close_click':
                                case 'use_meta_mask_instead_clicked':
                                case 'on_continue_with_meta_mask':
                                case 'on_minimize_click':
                                case 'close':
                                case 'on_user_confirmed_connection_with_safety_checks':
                                case 'reject_connection_button_click':
                                    setState({ type: 'minimised' })
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
