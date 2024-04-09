import { useEffect } from 'react'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { ErrorPopup as LedgerErrorPopup } from '@zeal/domains/Error/domains/Ledger/components/ErrorPopup'
import { ErrorPopup as TrezorErrorPopup } from '@zeal/domains/Error/domains/Trezor/components/ErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap } from '@zeal/domains/Network'
import {
    EthSignTypedData,
    EthSignTypedDataV3,
    EthSignTypedDataV4,
    PersonalSign,
} from '@zeal/domains/RPCRequest'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'
import { SignOnHardwareWalletPopup } from '@zeal/domains/TransactionRequest/components/SignOnHardwareWalletPopup'

import { Flow, VisualState as FlowVisualState } from './Flow'

// https://docs.metamask.io/wallet/how-to/sign-data/

type Props = {
    installationId: string
    sessionPassword: string
    keyStore: KeyStore
    request:
        | PersonalSign
        | EthSignTypedData
        | EthSignTypedDataV3
        | EthSignTypedDataV4

    state: State

    account: Account
    dApp: DAppSiteInfo
    network: Network
    networkMap: NetworkMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'message_signed'; signature: string }
    | Extract<
          MsgOf<typeof Flow>,
          {
              type:
                  | 'cancel_button_click'
                  | 'keystore_added'
                  | 'password_added'
                  | 'on_minimize_click'
                  | 'drag'
                  | 'on_expand_request'
                  | 'import_keys_button_clicked'
          }
      >

export type State = FlowVisualState

export const Signing = ({
    sessionPassword,
    onMsg,
    account,
    keyStore,
    state,
    dApp,
    request,
    network,
    networkMap,
    installationId,
    actionSource,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(signMessage)
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
                break
            case 'loading':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'message_signed',
                    signature: loadable.data,
                })
                break
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Flow
                    installationId={installationId}
                    networkMap={networkMap}
                    state={state}
                    isLoading={false}
                    keyStore={keyStore}
                    request={request}
                    account={account}
                    dApp={dApp}
                    network={network}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                            case 'drag':
                            case 'cancel_button_click':
                            case 'on_minimize_click':
                            case 'import_keys_button_clicked':
                                onMsg(msg)
                                break
                            case 'sign_click':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        keyStore: msg.keyStore,
                                        sessionPassword,
                                        request: msg.request,
                                        network,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
        case 'loaded':
            return (
                <>
                    <Flow
                        installationId={installationId}
                        networkMap={networkMap}
                        state={state}
                        isLoading
                        keyStore={keyStore}
                        request={request}
                        account={account}
                        dApp={dApp}
                        network={network}
                        actionSource={actionSource}
                        onMsg={noop}
                    />
                    {(() => {
                        switch (loadable.params.keyStore.type) {
                            case 'secret_phrase_key':
                            case 'private_key_store':
                            case 'safe_4337':
                                return null

                            case 'trezor':
                            case 'ledger':
                                return (
                                    <SignOnHardwareWalletPopup
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setLoadable({
                                                        type: 'not_asked',
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        msg.type
                                                    )
                                            }
                                        }}
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(loadable.params.keyStore)
                        }
                    })()}
                </>
            )

        case 'error': {
            const error = parseAppError(loadable.error)
            return (
                <>
                    <Flow
                        installationId={installationId}
                        networkMap={networkMap}
                        state={state}
                        isLoading
                        keyStore={keyStore}
                        request={request}
                        account={account}
                        dApp={dApp}
                        network={network}
                        actionSource={actionSource}
                        onMsg={noop}
                    />
                    {(() => {
                        switch (error.type) {
                            case 'trezor_connection_already_initialized':
                            case 'trezor_popup_closed':
                            case 'trezor_permissions_not_granted':
                            case 'trezor_method_cancelled':
                            case 'trezor_action_cancelled':
                            case 'trezor_pin_cancelled':
                            case 'trezor_device_used_elsewhere':
                                return (
                                    <TrezorErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_trezor_error_close':
                                                    onMsg({
                                                        type: 'cancel_button_click',
                                                    })
                                                    break
                                                case 'on_sync_trezor_click':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            case 'ledger_not_running_any_app':
                            case 'hardware_wallet_failed_to_open_device':
                            case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
                            case 'ledger_running_non_eth_app':
                            case 'ledger_is_locked':
                            case 'user_trx_denied_by_user':
                                return (
                                    <LedgerErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'on_ledger_error_close':
                                                    onMsg({
                                                        type: 'cancel_button_click',
                                                    })
                                                    break
                                                case 'on_sync_ledger_click':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    onMsg({
                                                        type: 'cancel_button_click',
                                                    })
                                                    break
                                                case 'try_again_clicked':
                                                    setLoadable({
                                                        type: 'loading',
                                                        params: loadable.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
