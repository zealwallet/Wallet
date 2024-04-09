import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { ChooseToken } from './ChooseToken'
import { Form } from './Form'
import { Form as InitialForm } from './Form/Layout'

type Props = {
    portfolio: Portfolio
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'track_wallet_clicked'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_safe_transaction_completed_splash_animation_screen_competed'
                  | 'on_transaction_relayed'
                  | 'on_gas_currency_selected'
                  | 'transaction_request_replaced'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_4337_gas_currency_selected'
          }
      >
type State =
    | { type: 'select_token' }
    | { type: 'form'; form: InitialForm }
    | {
          type: 'submit_transaction'
          ethTransaction: EthSendTransaction
          network: Network
          form: InitialForm
      }

export const NoTokenSelected = ({
    account,
    portfolioMap,
    accountsMap,
    sessionPassword,
    customCurrencies,
    onMsg,
    gasCurrencyPresetMap,
    installationId,
    feePresetMap,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_token' })

    switch (state.type) {
        case 'select_token':
            return (
                <ChooseToken
                    portfolio={portfolio}
                    networkMap={networkMap}
                    selectedToken={null}
                    knownCurrencies={portfolio.currencies}
                    account={account}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_token_select':
                                setState({
                                    type: 'form',
                                    form: {
                                        type: 'amount_in_tokens',
                                        token: msg.token,
                                        amount: null,
                                        toAddress: null,
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
        case 'form':
            return (
                <Form
                    installationId={installationId}
                    initialForm={state.form}
                    portfolio={portfolio}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    customCurrencies={customCurrencies}
                    sessionPassword={sessionPassword}
                    portfolioMap={portfolioMap}
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'select_token' })
                                break
                            case 'on_submit_form':
                                setState({
                                    type: 'submit_transaction',
                                    ethTransaction: msg.request,
                                    network: msg.network,
                                    form: msg.form,
                                })
                                break
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_transaction':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="send"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    accounts={accountsMap}
                    keystores={keyStoreMap}
                    state={{ type: 'maximised' }}
                    dApp={null}
                    network={state.network}
                    networkRPCMap={networkRPCMap}
                    account={account}
                    sendTransactionRequest={state.ethTransaction}
                    sessionPassword={sessionPassword}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_failure_accepted':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_minimize_click':
                            case 'on_close_transaction_status_not_found_modal':
                                setState({
                                    type: 'form',
                                    form: state.form,
                                })
                                break

                            case 'on_completed_transaction_close_click':
                            case 'on_completed_safe_transaction_close_click':
                            case 'transaction_cancel_success':
                                onMsg({ type: 'close' })
                                break
                            case 'on_expand_request':
                            case 'drag':
                                break

                            case 'import_keys_button_clicked':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                            case 'on_4337_gas_currency_selected':
                            case 'transaction_request_replaced':
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
