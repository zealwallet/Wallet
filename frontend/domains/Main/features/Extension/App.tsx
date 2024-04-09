import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { mapValues } from '@zeal/toolkit/Object'

import { Address } from '@zeal/domains/Address'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Mode } from '@zeal/domains/Main'
import { sendToActiveTabZWidget } from '@zeal/domains/Main/api/sendToActiveTabZWidget'
import { GetStarted } from '@zeal/domains/Main/components/GetStarted'
import { Manifest } from '@zeal/domains/Manifest'
import { NetworkMap } from '@zeal/domains/Network'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { updateNetworkRPC } from '@zeal/domains/Network/helpers/updateNetworkRPC'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { Storage } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { changeAccountLabel } from '@zeal/domains/Storage/helpers/changeAccountLabel'
import { lock, logout } from '@zeal/domains/Storage/helpers/logout'
import { removeAccount } from '@zeal/domains/Storage/helpers/removeAccount'
import { saveSessionPassword } from '@zeal/domains/Storage/helpers/saveSessionPassword'
import { toLocalStorage } from '@zeal/domains/Storage/helpers/toLocalStorage'
import { removeTransactionRequest } from '@zeal/domains/TransactionRequest/helpers/removeTransactionRequest'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { PortfolioLoader } from './PortfolioLoader'

type Props = {
    mode: Mode
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    manifest: Manifest
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_get_started_clicked' }
    | Extract<
          MsgOf<typeof PortfolioLoader>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'on_recovery_kit_setup'
                  | 'on_send_nft_click'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_send_clicked'
                  | 'safe_wallet_clicked'
                  | 'on_bank_transfer_selected'
                  | 'on_kyc_try_again_clicked'
                  | 'on_add_private_key_click'
                  | 'on_open_fullscreen_view_click'
                  | 'from_any_wallet_click'
                  | 'on_nba_cta_click'
                  | 'on_zwidget_expand_request'
                  | 'on_bank_clicked'
          }
      >

type State =
    | {
          type: 'get_started_splash_screen'
      }
    | {
          type: 'lock_screen'
          encryptedPassword: string
          storage: Storage
      }
    | {
          type: 'app'
          sessionPassword: string
          selectedAddress: Address
          storage: Storage
      }

const calculateState = ({
    storage,
    sessionPassword,
}: {
    storage: Storage | null
    sessionPassword: string | null
}): State => {
    if (!storage || !storage.selectedAddress) {
        return { type: 'get_started_splash_screen' }
    }

    if (!sessionPassword) {
        return {
            type: 'lock_screen',
            storage,
            encryptedPassword: storage.encryptedPassword,
        }
    }

    return {
        type: 'app',
        storage,
        sessionPassword,
        selectedAddress: storage.selectedAddress,
    }
}

export const App = ({
    storage,
    mode,
    sessionPassword,
    manifest,
    installationId,
    networkMap,
    onMsg,
}: Props) => {
    const state = calculateState({ storage, sessionPassword })

    switch (state.type) {
        case 'get_started_splash_screen':
            return (
                <GetStarted
                    mode={mode}
                    onGetStartedClicked={() =>
                        onMsg({ type: 'on_get_started_clicked' })
                    }
                />
            )

        case 'lock_screen':
            return (
                <LockScreen
                    encryptedPassword={state.encryptedPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                window.close()
                                break
                            case 'session_password_decrypted':
                                await saveSessionPassword(msg.sessionPassword)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'app':
            return (
                <PortfolioLoader
                    mode={mode}
                    currencyHiddenMap={state.storage.currencyHiddenMap}
                    currencyPinMap={state.storage.currencyPinMap}
                    networkMap={networkMap}
                    customCurrencies={state.storage.customCurrencies}
                    installationId={installationId}
                    connections={state.storage.dApps}
                    selectedAddress={state.selectedAddress}
                    manifest={manifest}
                    storage={state.storage}
                    sessionPassword={state.sessionPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'cancel_submitted': {
                                const from =
                                    msg.transactionRequest.account.address

                                const removed = state.storage
                                    .transactionRequests[from]
                                    ? removeTransactionRequest(
                                          state.storage.transactionRequests[
                                              from
                                          ],
                                          msg.transactionRequest
                                      )
                                    : []

                                await toLocalStorage({
                                    ...state.storage,
                                    transactionRequests: {
                                        ...state.storage.transactionRequests,
                                        [from]: removed,
                                    },
                                })
                                break
                            }
                            case 'transaction_submited': {
                                const from =
                                    msg.transactionRequest.account.address

                                const existingRequests = state.storage
                                    .transactionRequests[from]
                                    ? removeTransactionRequest(
                                          state.storage.transactionRequests[
                                              from
                                          ],
                                          msg.transactionRequest
                                      )
                                    : []

                                await toLocalStorage({
                                    ...state.storage,
                                    transactionRequests: {
                                        ...state.storage.transactionRequests,
                                        [from]: [
                                            msg.transactionRequest,
                                            ...existingRequests,
                                        ],
                                    },
                                })
                                break
                            }
                            case 'on_withdrawal_monitor_fiat_transaction_success': {
                                const removed =
                                    state.storage.submittedOffRampTransactions.filter(
                                        (submitted) =>
                                            submitted.transactionHash !==
                                            msg.event.transactionHash
                                    )

                                await toLocalStorage({
                                    ...state.storage,
                                    submittedOffRampTransactions: removed,
                                })
                                break
                            }

                            case 'on_token_pin_click':
                                postUserEvent({
                                    type: 'AssetStarredEvent',
                                    assetType: 'token',
                                    installationId,
                                })
                                await toLocalStorage({
                                    ...state.storage,
                                    currencyPinMap: {
                                        ...state.storage.currencyPinMap,
                                        [msg.currency.id]: true,
                                    },
                                })
                                break

                            case 'on_token_un_pin_click':
                                postUserEvent({
                                    type: 'AssetUnstarredEvent',
                                    assetType: 'token',
                                    installationId,
                                })
                                await toLocalStorage({
                                    ...state.storage,
                                    currencyPinMap: {
                                        ...state.storage.currencyPinMap,
                                        [msg.currency.id]: false,
                                    },
                                })
                                break
                            case 'on_token_hide_click':
                                postUserEvent({
                                    type: 'AssetHiddenEvent',
                                    assetType: 'token',
                                    installationId,
                                })
                                await toLocalStorage({
                                    ...state.storage,
                                    currencyHiddenMap: {
                                        ...state.storage.currencyHiddenMap,
                                        [msg.token.balance.currencyId]: true,
                                    },
                                })
                                break
                            case 'on_token_un_hide_click':
                                postUserEvent({
                                    type: 'AssetUnhiddenEvent',
                                    assetType: 'token',
                                    installationId,
                                })
                                await toLocalStorage({
                                    ...state.storage,
                                    currencyHiddenMap: {
                                        ...state.storage.currencyHiddenMap,
                                        [msg.token.balance.currencyId]: false,
                                    },
                                })
                                break

                            case 'on_dismiss_kyc_button_clicked':
                                switch (state.storage.bankTransferInfo.type) {
                                    case 'not_started':
                                        captureError(
                                            new ImperativeError(
                                                'Dismiss KYC button clicked when bank transfer not started'
                                            )
                                        )
                                        break

                                    case 'unblock_user_created':
                                    case 'bank_transfer_unblock_user_created_for_safe_wallet':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                ...state.storage
                                                    .bankTransferInfo,
                                                sumSubAccessToken: null,
                                            },
                                        })
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(
                                            state.storage.bankTransferInfo
                                        )
                                }

                                break

                            case 'on_delete_all_dapps_confirm_click':
                                await toLocalStorage({
                                    ...state.storage,
                                    dApps: mapValues(
                                        state.storage.dApps,
                                        (_, connection) => {
                                            switch (connection.type) {
                                                case 'connected_to_meta_mask':
                                                    return {
                                                        type: 'disconnected',
                                                        networkHexId:
                                                            DEFAULT_NETWORK.hexChainId,
                                                        dApp: connection.dApp,
                                                    }
                                                case 'disconnected':
                                                case 'connected':
                                                    return {
                                                        type: 'disconnected',
                                                        networkHexId:
                                                            connection.networkHexId,
                                                        dApp: connection.dApp,
                                                    }
                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(
                                                        connection
                                                    )
                                            }
                                        }
                                    ),
                                })
                                break
                            case 'on_disconnect_dapps_click':
                                const newApps = mapValues(
                                    state.storage.dApps,
                                    (
                                        _,
                                        connection: DAppConnectionState
                                    ): DAppConnectionState => {
                                        const { hostname } = connection.dApp
                                        const { dAppHostNames } = msg

                                        if (!dAppHostNames.includes(hostname)) {
                                            return connection
                                        }

                                        switch (connection.type) {
                                            case 'connected_to_meta_mask':
                                                return connection
                                            case 'connected':
                                            case 'disconnected':
                                                return {
                                                    type: 'disconnected',
                                                    dApp: connection.dApp,
                                                    networkHexId:
                                                        connection.networkHexId,
                                                }
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(connection)
                                        }
                                    }
                                )

                                await toLocalStorage({
                                    ...state.storage,
                                    dApps: newApps,
                                })

                                break
                            case 'on_profile_change_confirm_click':
                                const account =
                                    state.storage.accounts[msg.account.address]
                                if (!account) {
                                    throw new ImperativeError(
                                        'no account by address'
                                    )
                                }
                                await toLocalStorage({
                                    ...state.storage,
                                    accounts: {
                                        ...state.storage.accounts,
                                        [account.address]: {
                                            ...account,
                                            avatarSrc: msg.src,
                                        },
                                    },
                                })

                                break
                            case 'on_custom_currency_update_request':
                                await toLocalStorage({
                                    ...state.storage,
                                    customCurrencies: {
                                        ...state.storage.customCurrencies,
                                        [msg.currency.id]: msg.currency,
                                    },
                                })
                                break
                            case 'on_custom_currency_delete_request':
                                const customCurrencies = {
                                    ...state.storage.customCurrencies,
                                }
                                delete customCurrencies[msg.currency.id]
                                await toLocalStorage({
                                    ...state.storage,
                                    customCurrencies,
                                })
                                break
                            case 'on_account_label_change_submit':
                                await toLocalStorage(
                                    changeAccountLabel(
                                        state.storage,
                                        msg.account,
                                        msg.label
                                    )
                                )
                                break
                            case 'on_account_create_request':
                                msg.accountsWithKeystores.forEach(
                                    ({ keystore }) => {
                                        postUserEvent({
                                            type: 'WalletAddedEvent',
                                            keystoreType:
                                                keystoreToUserEventType(
                                                    keystore
                                                ),
                                            keystoreId: keystore.id,
                                            installationId,
                                        })
                                    }
                                )
                                await toLocalStorage(
                                    addAccountsWithKeystores(
                                        state.storage,
                                        msg.accountsWithKeystores
                                    )
                                )
                                break

                            case 'portfolio_loaded':
                                await toLocalStorage({
                                    ...state.storage,
                                    portfolios: {
                                        ...state.storage.portfolios,
                                        [msg.address]: msg.portfolio,
                                    },
                                    fetchedAt: msg.fetchedAt,
                                })
                                break
                            case 'account_item_clicked':
                                const result = await sendToActiveTabZWidget({
                                    type: 'extension_to_zwidget_extension_address_change',
                                    address: msg.account.address,
                                })

                                switch (result.type) {
                                    case 'zwidget_not_active':
                                        await toLocalStorage({
                                            ...state.storage,
                                            selectedAddress:
                                                msg.account.address,
                                        })
                                        break
                                    case 'message_sent_to_zwidget':
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(result)
                                }

                                break
                            case 'confirm_account_delete_click': {
                                const newStorage = removeAccount(
                                    state.storage,
                                    msg.account
                                )

                                newStorage && newStorage.selectedAddress
                                    ? await toLocalStorage(newStorage)
                                    : logout()

                                break
                            }

                            case 'transaction_request_completed':
                            case 'transaction_request_failed':
                            case 'transaction_request_replaced':
                            case 'on_transaction_completed_splash_animation_screen_competed': {
                                const { account } = msg.transactionRequest
                                const transactionRequests = {
                                    [account.address]: removeTransactionRequest(
                                        state.storage.transactionRequests[
                                            account.address
                                        ],
                                        msg.transactionRequest
                                    ),
                                }

                                await toLocalStorage({
                                    ...state.storage,
                                    transactionRequests,
                                })
                                break
                            }

                            case 'on_lock_zeal_click':
                                lock().catch(captureError)

                                break

                            case 'bridge_completed':
                                const fromAddress =
                                    msg.bridgeSubmitted.fromAddress

                                const currentSubmitedBridges =
                                    state.storage.submitedBridges[
                                        fromAddress
                                    ] || []
                                await toLocalStorage({
                                    ...state.storage,
                                    submitedBridges: {
                                        ...state.storage.submitedBridges,
                                        [fromAddress]:
                                            currentSubmitedBridges.filter(
                                                (bridge) =>
                                                    bridge.sourceTransactionHash !==
                                                    msg.bridgeSubmitted
                                                        .sourceTransactionHash
                                            ),
                                    },
                                })
                                break

                            case 'on_rpc_change_confirmed':
                                await toLocalStorage({
                                    ...state.storage,
                                    networkRPCMap: {
                                        ...state.storage.networkRPCMap,
                                        [msg.network.hexChainId]:
                                            updateNetworkRPC({
                                                network: msg.network,
                                                initialRPCUrl:
                                                    msg.initialRPCUrl,
                                                networkRPCMap:
                                                    state.storage.networkRPCMap,
                                                rpcUrl: msg.rpcUrl,
                                            }),
                                    },
                                })
                                break

                            case 'on_select_rpc_click':
                                await toLocalStorage({
                                    ...state.storage,
                                    networkRPCMap: {
                                        ...state.storage.networkRPCMap,
                                        [msg.network.hexChainId]:
                                            msg.networkRPC,
                                    },
                                })
                                break

                            case 'on_nba_close_click': {
                                await toLocalStorage({
                                    ...state.storage,
                                    userMadeActionOnNextBestActionIds: [
                                        ...new Set([
                                            ...state.storage
                                                .userMadeActionOnNextBestActionIds,
                                            msg.slide.id,
                                        ]),
                                    ],
                                })
                                break
                            }
                            case 'on_nba_cta_click':
                            case 'on_add_private_key_click':
                            case 'track_wallet_clicked':
                            case 'hardware_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'on_bank_transfer_selected':
                            case 'safe_wallet_clicked':
                            case 'on_recovery_kit_setup':
                            case 'on_send_nft_click':
                            case 'on_swap_clicked':
                            case 'on_bridge_clicked':
                            case 'on_send_clicked':
                            case 'on_kyc_try_again_clicked':
                            case 'on_open_fullscreen_view_click':
                            case 'from_any_wallet_click':
                            case 'on_zwidget_expand_request':
                            case 'on_bank_clicked':
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
