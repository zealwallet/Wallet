import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    FetchPortfolioRequest,
    FetchPortfolioResponse,
} from '@zeal/domains/Account/api/fetchAccounts'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { ConnectionMap } from '@zeal/domains/DApp/domains/ConnectionState'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Mode } from '@zeal/domains/Main'
import { Manifest } from '@zeal/domains/Manifest'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { BankTransferInfo, CustomCurrencyMap } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    mode: Mode
    manifest: Manifest
    account: Account
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    portfolioLoadable: ReloadableData<
        FetchPortfolioResponse,
        FetchPortfolioRequest
    >
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    installationId: string
    networkMap: NetworkMap
    encryptedPassword: string
    sessionPassword: string
    transactionRequests: Record<Address, Submited[]>
    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    connections: ConnectionMap
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    userMadeActionOnNextBestActionIds: string[]
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'on_profile_change_confirm_click'
                  | 'reload_button_click'
                  | 'on_recovery_kit_setup'
                  | 'on_account_label_change_submit'
                  | 'confirm_account_delete_click'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'account_item_clicked'
                  | 'on_network_item_click'
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'transaction_request_cancelled'
                  | 'on_disconnect_dapps_click'
                  | 'on_delete_all_dapps_confirm_click'
                  | 'on_lock_zeal_click'
                  | 'on_send_nft_click'
                  | 'bridge_completed'
                  | 'on_dismiss_kyc_button_clicked'
                  | 'on_kyc_try_again_clicked'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_onramp_success'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_add_private_key_click'
                  | 'on_open_fullscreen_view_click'
                  | 'from_any_wallet_click'
                  | 'on_nba_close_click'
                  | 'on_refresh_button_clicked'
                  | 'on_nba_cta_click'
                  | 'on_zwidget_expand_request'
                  | 'on_send_clicked'
                  | 'on_bank_clicked'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
                  | 'on_send_clicked'
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_bank_transfer_selected'
                  | 'on_token_pin_click'
                  | 'on_token_un_pin_click'
                  | 'on_token_hide_click'
                  | 'on_token_un_hide_click'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'safe_wallet_clicked'
                  | 'transaction_request_replaced'
          }
      >

export const TabController = ({
    mode,
    accounts,
    account,
    selectedNetwork,
    networkRPCMap,
    portfolioMap,
    portfolioLoadable,
    keystoreMap,
    installationId,
    encryptedPassword,
    manifest,
    transactionRequests,
    submittedOffRampTransactions,
    submitedBridgesMap,
    connections,
    sessionPassword,
    customCurrencyMap,
    networkMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    userMadeActionOnNextBestActionIds,
    onMsg,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const keyStore = getKeyStore({
        keyStoreMap: keystoreMap,
        address: account.address,
    })

    const onBankTransferSelected = () => {
        switch (bankTransferInfo.type) {
            case 'not_started':
                onMsg({
                    type: 'on_bank_transfer_selected',
                })
                break

            case 'unblock_user_created':
            case 'bank_transfer_unblock_user_created_for_safe_wallet':
                if (
                    bankTransferInfo.connectedWalletAddress === account.address
                ) {
                    onMsg({
                        type: 'on_bank_transfer_selected',
                    })
                } else {
                    const account =
                        accounts[bankTransferInfo.connectedWalletAddress]

                    if (account) {
                        setModalState({
                            type: 'bank_transfer_setup_for_another_account',
                            bankTransferSetupForAccount: account,
                        })
                    } else {
                        throw new ImperativeError(
                            'Bank transfer was setup with deleted wallet'
                        )
                    }
                }
                break

            /* istanbul ignore next */
            default:
                notReachable(bankTransferInfo)
        }
    }
    return (
        <>
            <Layout
                sessionPassword={sessionPassword}
                userMadeActionOnNextBestActionIds={
                    userMadeActionOnNextBestActionIds
                }
                installationId={installationId}
                mode={mode}
                customCurrencyMap={customCurrencyMap}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                submitedBridgesMap={submitedBridgesMap}
                account={account}
                accounts={accounts}
                connections={connections}
                encryptedPassword={encryptedPassword}
                submittedOffRampTransactions={submittedOffRampTransactions}
                keystoreMap={keystoreMap}
                manifest={manifest}
                portfolioLoadable={portfolioLoadable}
                portfolioMap={portfolioMap}
                selectedNetwork={selectedNetwork}
                networkRPCMap={networkRPCMap}
                transactionRequests={transactionRequests}
                bankTransferInfo={bankTransferInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_transaction_request_widget_click':
                            setModalState({
                                type: 'submitted_transaction_request_status_popup',
                                transactionRequest: msg.transactionRequest,
                                keyStore: msg.keyStore,
                            })
                            break
                        case 'on_token_click':
                            setModalState({
                                type: 'transact_popup',
                                token: msg.token,
                            })
                            break

                        case 'on_bridge_submitted_click':
                            setModalState({
                                type: 'bridge_submitted_status_popup',
                                bridgeSubmitted: msg.bridgeSubmitted,
                            })
                            break

                        case 'settings_add_new_account_click':
                            setModalState({
                                type: 'select_type_of_account_to_add',
                            })
                            break

                        case 'bank_transfer_click':
                        case 'on_bank_transfer_selected':
                        case 'on_do_bank_transfer_clicked':
                            onBankTransferSelected()
                            break

                        case 'on_token_settings_click':
                        case 'on_receive_selected':
                            switch (keyStore.type) {
                                case 'track_only':
                                    setModalState({
                                        type: 'tracked_only_wallet_selected',
                                    })
                                    break
                                case 'private_key_store':
                                case 'ledger':
                                case 'secret_phrase_key':
                                case 'trezor':
                                case 'safe_4337':
                                    setModalState({ type: 'receive_token' })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(keyStore)
                            }

                            break

                        case 'on_send_clicked':
                        case 'on_swap_clicked':
                        case 'on_bridge_clicked':
                        case 'on_token_pin_click':
                        case 'on_token_un_pin_click':
                        case 'on_token_hide_click':
                        case 'on_token_un_hide_click':
                        case 'on_rpc_change_confirmed':
                        case 'on_select_rpc_click':
                        case 'on_send_nft_click':
                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                        case 'on_profile_change_confirm_click':
                        case 'reload_button_click':
                        case 'on_recovery_kit_setup':
                        case 'on_account_label_change_submit':
                        case 'confirm_account_delete_click':
                        case 'on_account_create_request':
                        case 'account_item_clicked':
                        case 'on_network_item_click':
                        case 'transaction_request_completed':
                        case 'transaction_request_failed':
                        case 'on_disconnect_dapps_click':
                        case 'on_delete_all_dapps_confirm_click':
                        case 'on_lock_zeal_click':
                        case 'bridge_completed':
                        case 'track_wallet_clicked':
                        case 'on_dismiss_kyc_button_clicked':
                        case 'on_kyc_try_again_clicked':
                        case 'on_onramp_success':
                        case 'on_withdrawal_monitor_fiat_transaction_success':
                        case 'on_add_private_key_click':
                        case 'on_open_fullscreen_view_click':
                        case 'from_any_wallet_click':
                        case 'transaction_request_replaced':
                        case 'on_nba_close_click':
                        case 'on_nba_cta_click':
                        case 'on_refresh_button_clicked':
                        case 'on_zwidget_expand_request':
                        case 'on_bank_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'safe_wallet_clicked':
                            onMsg(msg)
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                installationId={installationId}
                accountsMap={accounts}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                state={modalState}
                currentNetwork={selectedNetwork}
                account={account}
                keyStoreMap={keystoreMap}
                portfolioMap={portfolioMap}
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_accounts_create_success_animation_finished':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_continue_to_bank_transfer_clicked':
                            onMsg({ type: 'on_bank_transfer_selected' })
                            break

                        case 'create_clicked': {
                            try {
                                const secretPhraseMap =
                                    await groupBySecretPhrase(
                                        values(accounts),
                                        keystoreMap,
                                        sessionPassword
                                    )

                                setModalState({
                                    type: 'add_from_secret_phrase',
                                    secretPhraseMap,
                                })
                            } catch (e) {
                                captureError(e)
                            }
                            break
                        }

                        case 'on_bank_transfer_selected':
                            onBankTransferSelected()
                            break

                        case 'on_swap_clicked':
                        case 'on_bridge_clicked':
                            if (!keyStore) {
                                setModalState({
                                    type: 'tracked_only_wallet_selected',
                                })
                            } else {
                                onMsg(msg)
                            }
                            break

                        case 'on_receive_selected':
                            switch (keyStore.type) {
                                case 'track_only':
                                    setModalState({
                                        type: 'tracked_only_wallet_selected',
                                    })
                                    break
                                case 'private_key_store':
                                case 'ledger':
                                case 'secret_phrase_key':
                                case 'trezor':
                                case 'safe_4337':
                                    setModalState({ type: 'receive_token' })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(keyStore)
                            }

                            break

                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                        case 'on_send_clicked':
                        case 'bridge_completed':
                        case 'transaction_submited':
                        case 'cancel_submitted':
                        case 'on_account_create_request':
                        case 'on_token_pin_click':
                        case 'on_token_un_pin_click':
                        case 'on_token_un_hide_click':
                        case 'on_transaction_completed_splash_animation_screen_competed':
                        case 'safe_wallet_clicked':
                        case 'transaction_request_replaced':
                            onMsg(msg)
                            break
                        case 'on_token_hide_click':
                            setModalState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'on_add_active_wallet_clicked':
                            setModalState({
                                type: 'select_type_of_account_to_add',
                            })
                            break

                        case 'tracked_only_wallet_selected':
                            setModalState({
                                type: 'tracked_only_wallet_selected',
                            })
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
