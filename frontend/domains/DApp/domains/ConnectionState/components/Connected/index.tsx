import { useLayoutEffect, useState } from 'react'

import { DragAndDropBar } from '@zeal/uikit/DragAndClickHandler'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Expanded, Msg as ExpandedMsg } from './Expanded'

import { Connected as ConnectedState } from '../..'

type Props = {
    connectionState: ConnectedState

    selectedNetwork: Network
    selectedAccount: Account

    encryptedPassword: string
    sessionPassword: string | null
    alternativeProvider: AlternativeProvider
    accounts: AccountsMap

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap

    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'expanded' }
    | { type: 'minimized' }
    | Exclude<
          ExpandedMsg,
          { type: 'on_minimize_click' | 'lock_screen_close_click' }
      >
    | Extract<MsgOf<typeof ConnectedMinimized>, { type: 'drag' }>

type State = { type: 'expanded' } | { type: 'minimized' }

export const Connected = ({
    connectionState,
    selectedAccount,
    selectedNetwork,
    sessionPassword,
    encryptedPassword,
    portfolioMap,
    keystores,
    accounts,
    alternativeProvider,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'minimized' })
    const liveMsg = useLiveRef(onMsg)

    useLayoutEffect(() => {
        switch (state.type) {
            case 'expanded':
                liveMsg.current({ type: 'expanded' })
                break
            case 'minimized':
                liveMsg.current({ type: 'minimized' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    switch (state.type) {
        case 'expanded':
            return (
                <>
                    <DragAndDropBar onMsg={onMsg} />
                    <Expanded
                        installationId={installationId}
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        customCurrencyMap={customCurrencyMap}
                        selectedNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        selectedAccount={selectedAccount}
                        encryptedPassword={encryptedPassword}
                        sessionPassword={sessionPassword}
                        connectionState={connectionState}
                        accounts={accounts}
                        portfolioMap={portfolioMap}
                        keystores={keystores}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'lock_screen_close_click':
                                case 'on_minimize_click':
                                    setState({ type: 'minimized' })
                                    break
                                case 'account_item_clicked':
                                case 'add_wallet_clicked':
                                case 'disconnect_button_click':
                                case 'hardware_wallet_clicked':
                                case 'on_account_create_request':
                                case 'on_continue_with_meta_mask':
                                case 'on_network_item_click':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                case 'session_password_decrypted':
                                case 'track_wallet_clicked':
                                case 'safe_wallet_clicked':
                                case 'use_meta_mask_instead_clicked':
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
        case 'minimized':
            return (
                <ConnectedMinimized
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
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
