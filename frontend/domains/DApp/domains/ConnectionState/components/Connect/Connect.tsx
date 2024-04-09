import { useEffect, useState } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchConnectionSafetychecks } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { MetaMaskSelected } from './MetaMaskSelected'
import { ZealWalletSelected } from './ZealWalletSelected'

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
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof ZealWalletSelected>,
          {
              type:
                  | 'reject_connection_button_click'
                  | 'on_minimize_click'
                  | 'add_new_account_click'
                  | 'add_wallet_clicked'
                  | 'track_wallet_clicked'
                  | 'safe_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'use_meta_mask_instead_clicked'
          }
      >
    | Extract<
          MsgOf<typeof MetaMaskSelected>,
          {
              type:
                  | 'on_user_confirmed_connection_with_safety_checks'
                  | 'on_continue_with_meta_mask'
                  | 'on_zeal_account_connection_request'
          }
      >
    | { type: 'dApp_info_loaded'; dApp: DAppSiteInfo }
    | { type: 'zeal_account_connected'; account: Account; network: Network } // TODO @max-tern :: naming is telling how parent will react, not what happened zeal_account_connected_animation_finish

type State =
    | {
          type: 'zeal_provider'
          account: Account
          network: Network
      }
    | {
          type: 'metamask_provider'
          provider: 'metamask'
      }

export const Connect = ({
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
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() => {
        switch (connectionState.type) {
            case 'not_interacted':
            case 'disconnected':
                return {
                    type: 'zeal_provider',
                    network: requestedNetwork,
                    account: initialAccount,
                }
            case 'connected_to_meta_mask':
                return {
                    type: 'metamask_provider',
                    provider: 'metamask',
                }
            /* istanbul ignore next */
            default:
                return notReachable(connectionState)
        }
    })

    const [safetyChecksLoadable] = useLoadableData(
        fetchConnectionSafetychecks,
        { type: 'loading', params: connectionState.dApp }
    )

    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (safetyChecksLoadable.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'dApp_info_loaded',
                    dApp: safetyChecksLoadable.data.dAppInfo,
                })
                break

            case 'loading':
            case 'error':
                break
            default:
                notReachable(safetyChecksLoadable)
        }
    }, [safetyChecksLoadable, liveOnMsg])

    switch (state.type) {
        case 'metamask_provider':
            return (
                <MetaMaskSelected
                    requestedNetwork={requestedNetwork}
                    installationId={installationId}
                    safetyChecksLoadable={safetyChecksLoadable}
                    connectionState={connectionState}
                    alternativeProvider={state.provider}
                    accounts={accounts}
                    customCurrencyMap={customCurrencyMap}
                    sessionPassword={sessionPassword}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    keystoreMap={keystores}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_minimize_click' })
                                break
                            case 'on_continue_with_meta_mask':
                            case 'on_user_confirmed_connection_with_safety_checks': // TODO  @max-tern :: naming? on_continue_with_meta_mask_after_safety_checks_confirmed
                            case 'on_zeal_account_connection_request':
                                onMsg(msg)
                                break

                            case 'on_account_create_request':
                                onMsg(msg)
                                break
                            case 'on_accounts_create_success_animation_finished':
                                setState({
                                    type: 'zeal_provider',
                                    account:
                                        msg.accountsWithKeystores[0].account,
                                    network: requestedNetwork,
                                })
                                break
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                            case 'track_wallet_clicked':
                            case 'safe_wallet_clicked':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'zeal_provider':
            return (
                <ZealWalletSelected
                    installationId={installationId}
                    connectionState={connectionState}
                    selectedNetwork={state.network}
                    safetyChecksLoadable={safetyChecksLoadable}
                    networkRPCMap={networkRPCMap}
                    selectedAccount={state.account}
                    alternativeProvider={alternativeProvider}
                    portfolioMap={portfolioMap}
                    keystores={keystores}
                    accounts={accounts}
                    customCurrencyMap={customCurrencyMap}
                    networkMap={networkMap}
                    sessionPassword={sessionPassword}
                    currencyHiddenMap={currencyHiddenMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                                setState({
                                    type: 'zeal_provider',
                                    account:
                                        msg.accountsWithKeystores[0].account,
                                    network: state.network,
                                })
                                onMsg(msg)
                                break
                            case 'account_item_clicked':
                                setState({
                                    type: 'zeal_provider',
                                    account: msg.account,
                                    network: state.network,
                                })
                                break
                            case 'on_network_item_click':
                                switch (msg.network.type) {
                                    case 'all_networks':
                                        throw new ImperativeError(
                                            'All networks not possible on Connect'
                                        )

                                    case 'specific_network':
                                        setState({
                                            type: 'zeal_provider',
                                            account: state.account,
                                            network: msg.network.network,
                                        })
                                        break

                                    default:
                                        notReachable(msg.network)
                                }
                                break
                            case 'connected_animation_complete':
                                onMsg({
                                    type: 'zeal_account_connected',
                                    network: state.network,
                                    account: state.account,
                                })
                                break
                            case 'other_provider_selected':
                                setState({
                                    type: 'metamask_provider',
                                    provider: 'metamask',
                                })
                                break
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                            case 'on_rpc_change_confirmed':
                            case 'on_select_rpc_click':
                            case 'reject_connection_button_click':
                            case 'on_minimize_click':
                            case 'use_meta_mask_instead_clicked':
                            case 'safe_wallet_clicked':
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
