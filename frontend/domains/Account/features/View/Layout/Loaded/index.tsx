import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { SubmitedBridgesMap } from '@zeal/domains/Currency/domains/Bridge'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Mode } from '@zeal/domains/Main'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferInfo } from '@zeal/domains/Storage'
import { Submited } from '@zeal/domains/TransactionRequest'

import { Layout } from './Layout'
import { Modal, Msg as ModalMsg, State as ModalState } from './Modal'

type Props = {
    keystoreMap: KeyStoreMap
    submitedBridgesMap: SubmitedBridgesMap
    submittedOffRampTransactions: SubmittedOfframpTransaction[]
    transactionRequests: Record<Address, Submited[]>
    portfolio: Portfolio
    accountsMap: AccountsMap
    account: Account
    currentNetwork: CurrentNetwork
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    fetchedAt: Date
    isLoading: boolean
    bankTransferInfo: BankTransferInfo
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    installationId: string
    userMadeActionOnNextBestActionIds: string[]
    mode: Mode
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'reload_button_click' }
    | Extract<
          ModalMsg,
          {
              type:
                  | 'on_profile_change_confirm_click'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_token_click'
                  | 'on_send_nft_click'
                  | 'bank_transfer_click'
                  | 'receive_click'
                  | 'from_any_wallet_click'
                  | 'network_filter_click'
          }
      >
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'account_filter_click'
                  | 'bridge_completed'
                  | 'on_network_filter_button_clicked'
                  | 'on_refresh_button_clicked'
                  | 'on_bridge_submitted_click'
                  | 'on_custom_currency_delete_request'
                  | 'on_custom_currency_update_request'
                  | 'on_dismiss_kyc_button_clicked'
                  | 'on_do_bank_transfer_clicked'
                  | 'on_kyc_try_again_clicked'
                  | 'on_onramp_success'
                  | 'on_recovery_kit_setup'
                  | 'on_tracked_tag_click'
                  | 'on_transaction_request_widget_click'
                  | 'transaction_request_cancelled'
                  | 'transaction_request_completed'
                  | 'transaction_request_failed'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'transaction_request_replaced'
                  | 'on_nba_close_click'
                  | 'on_nba_cta_click'
                  | 'on_open_fullscreen_view_click'
                  | 'on_zwidget_expand_request'
                  | 'on_send_clicked'
                  | 'on_bank_clicked'
                  | 'on_swap_clicked'
                  | 'on_bridge_clicked'
          }
      >

export const Loaded = ({
    portfolio,
    account,
    currentNetwork,
    isLoading,
    fetchedAt,
    accountsMap,
    keystoreMap,
    submitedBridgesMap,
    submittedOffRampTransactions,
    transactionRequests,
    networkMap,
    networkRPCMap,
    bankTransferInfo,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    userMadeActionOnNextBestActionIds,
    mode,
    onMsg,
}: Props) => {
    const [state, setState] = useState<ModalState>({ type: 'closed' })
    const keystore = getKeyStore({
        keyStoreMap: keystoreMap,
        address: account.address,
    })

    return (
        <>
            <Layout
                mode={mode}
                installationId={installationId}
                userMadeActionOnNextBestActionIds={
                    userMadeActionOnNextBestActionIds
                }
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                accountsMap={accountsMap}
                keyStoreMap={keystoreMap}
                submitedBridgesMap={submitedBridgesMap}
                transactionRequests={transactionRequests}
                submittedOffRampTransactions={submittedOffRampTransactions}
                keystore={keystore}
                fetchedAt={fetchedAt}
                isLoading={isLoading}
                portfolio={portfolio}
                account={account}
                currentNetwork={currentNetwork}
                networkRPCMap={networkRPCMap}
                bankTransferInfo={bankTransferInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_zwidget_expand_request':
                        case 'on_transaction_request_widget_click':
                        case 'transaction_request_completed':
                        case 'transaction_request_failed':
                        case 'account_filter_click':
                        case 'on_network_filter_button_clicked':
                        case 'reload_button_click':
                        case 'on_recovery_kit_setup':
                        case 'on_custom_currency_delete_request':
                        case 'on_custom_currency_update_request':
                        case 'on_token_click':
                        case 'bridge_completed':
                        case 'on_bridge_submitted_click':
                        case 'on_refresh_button_clicked':
                        case 'on_dismiss_kyc_button_clicked':
                        case 'on_kyc_try_again_clicked':
                        case 'on_do_bank_transfer_clicked':
                        case 'on_onramp_success':
                        case 'on_withdrawal_monitor_fiat_transaction_success':
                        case 'transaction_request_replaced':
                        case 'on_nba_close_click':
                        case 'on_nba_cta_click':
                        case 'on_open_fullscreen_view_click':
                        case 'on_send_clicked':
                        case 'on_bank_clicked':
                        case 'on_swap_clicked':
                        case 'on_bridge_clicked':
                            onMsg(msg)
                            break
                        case 'show_all_tokens_click':
                            setState({ type: 'show_all_tokens' })
                            break
                        case 'show_all_apps_click':
                            setState({ type: 'show_all_apps' })
                            break
                        case 'show_all_nft_click':
                            setState({ type: 'show_all_nfts' })
                            break
                        case 'on_nft_click':
                            setState({
                                type: 'nft_detailed_view',
                                nft: msg.nft,
                                nftCollection: msg.nftCollection,
                            })
                            break

                        case 'on_add_funds_click':
                            setState({
                                type: 'add_funds',
                            })
                            break

                        case 'on_app_position_click':
                            setState({
                                type: 'app_position',
                                app: msg.app,
                            })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                currencyPinMap={currencyPinMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                keystore={keystore}
                state={state}
                portfolio={portfolio}
                currentNetwork={currentNetwork}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setState({ type: 'closed' })
                            break
                        case 'bank_transfer_click':
                            setState({ type: 'closed' })
                            onMsg(msg)
                            break

                        case 'account_filter_click':
                        case 'network_filter_click':
                        case 'on_profile_change_confirm_click':
                        case 'on_custom_currency_update_request':
                        case 'on_custom_currency_delete_request':
                        case 'from_any_wallet_click':
                        case 'on_token_click':
                        case 'on_send_nft_click':
                            onMsg(msg)
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
