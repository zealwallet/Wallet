import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import {
    BridgeRequest,
    BridgeSubmitted,
} from '@zeal/domains/Currency/domains/Bridge'
import { CheckBridgeSubmittedStatus } from '@zeal/domains/Currency/domains/Bridge/features/CheckBridgeSubmittedStatus'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Form } from './Form'
import { SubmitSourceTransactions } from './SubmitSourceTransactions'

type Props = {
    account: Account
    portfolio: Portfolio
    keystoreMap: KeyStoreMap
    fromCurrencyId: CurrencyId | null
    currenciesMatrix: CurrenciesMatrix
    sessionPassword: string
    accountMap: AccountsMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    installationId: string
    swapSlippagePercent: number | null
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof CheckBridgeSubmittedStatus>
    | Extract<
          MsgOf<typeof SubmitSourceTransactions>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'source_transaction_submitted'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
          }
      >
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'on_set_slippage_percent'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
          }
      >

type State =
    | { type: 'form' }
    | { type: 'submit_source_transaction'; bridgeRequest: BridgeRequest }
    | {
          type: 'check_bridge_submitted_status'
          bridgeSubmitted: BridgeSubmitted
      }

export const Flow = ({
    account,
    fromCurrencyId,
    currenciesMatrix,
    keystoreMap,
    accountMap,
    sessionPassword,
    installationId,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    portfolio={portfolio}
                    keystoreMap={keystoreMap}
                    fromCurrencyId={fromCurrencyId}
                    currenciesMatrix={currenciesMatrix}
                    swapSlippagePercent={swapSlippagePercent}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_set_slippage_percent':
                            case 'on_rpc_change_confirmed':
                            case 'on_select_rpc_click':
                                onMsg(msg)
                                break
                            case 'on_bridge_continue_clicked':
                                setState({
                                    type: 'submit_source_transaction',
                                    bridgeRequest: msg.route,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_source_transaction':
            return (
                <SubmitSourceTransactions
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    request={state.bridgeRequest}
                    sessionPassword={sessionPassword}
                    account={account}
                    accountMap={accountMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'source_transaction_submitted':
                                setState({
                                    type: 'check_bridge_submitted_status',
                                    bridgeSubmitted: msg.request,
                                })
                                onMsg(msg)
                                break

                            case 'close':
                            case 'transaction_failure_accepted':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'on_close_transaction_status_not_found_modal':
                                setState({ type: 'form' })
                                break

                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break

                            case 'transaction_submited':
                            case 'on_transaction_cancelled_successfully_close_clicked':
                            case 'cancel_submitted':
                            case 'transaction_request_replaced':
                                // We do not report bridge transaction statuses to upper components
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'check_bridge_submitted_status':
            return (
                <CheckBridgeSubmittedStatus
                    networkMap={networkMap}
                    bridgeSubmitted={state.bridgeSubmitted}
                    account={account}
                    keystoreMap={keystoreMap}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
