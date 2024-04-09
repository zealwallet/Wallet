import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { SwapRoute } from '@zeal/domains/Currency/domains/SwapQuote'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

type Props = {
    route: SwapRoute

    sessionPassword: string
    account: Account
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolio: Portfolio
    feePresetMap: FeePresetMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    installationId: string

    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_all_transaction_success' }
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_wrong_network_accepted'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'on_safe_transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_safe_transaction_completed_splash_animation_screen_competed'
                  | 'on_gas_currency_selected'
                  | 'on_close_transaction_status_not_found_modal'
                  | 'transaction_request_replaced'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_4337_gas_currency_selected'
          }
      >

type State =
    | { type: 'submit_approval'; approvalTransaction: EthSendTransaction }
    | { type: 'submit_swap_trx' }

export const SubmitSwap = ({
    sessionPassword,
    account,
    accountsMap,
    keystoreMap,
    installationId,
    route,
    networkMap,
    portfolio,
    networkRPCMap,
    feePresetMap,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        route.approvalTransaction
            ? {
                  type: 'submit_approval',
                  approvalTransaction: route.approvalTransaction,
              }
            : { type: 'submit_swap_trx' }
    )

    switch (state.type) {
        case 'submit_swap_trx':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={route.swapTransaction.id}
                    source="swap"
                    sendTransactionRequest={route.swapTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={route.network}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: route.protocolDisplayName,
                        avatar: route.protocolIcon,
                        hostname: '',
                    }}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_4337_gas_currency_selected':
                            case 'on_close_transaction_status_not_found_modal':
                            case 'transaction_request_replaced':
                                onMsg(msg)
                                break

                            case 'on_completed_safe_transaction_close_click':
                            case 'on_completed_transaction_close_click':
                                onMsg({ type: 'on_all_transaction_success' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_approval':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="swapApprove"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={state.approvalTransaction.id}
                    sendTransactionRequest={state.approvalTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={route.network}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: route.protocolDisplayName,
                        avatar: route.protocolIcon,
                        hostname: '',
                    }}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_4337_gas_currency_selected':
                            case 'transaction_request_replaced':
                            case 'on_close_transaction_status_not_found_modal':
                                onMsg(msg)
                                break

                            case 'on_completed_transaction_close_click':
                            case 'on_completed_safe_transaction_close_click':
                                setState({ type: 'submit_swap_trx' })
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                onMsg(msg)
                                setState({ type: 'submit_swap_trx' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
