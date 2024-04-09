import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    OffRampTransaction,
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Form } from './Form'
import { SubmitTransaction } from './SubmitTransaction'

type Props = {
    currencies: BankTransferCurrencies
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    installationId: string
    sessionPassword: string
    network: Network
    networkRPCMap: NetworkRPCMap
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    offRampAccounts: OffRampAccount[]
    offRampTransactions: OffRampTransaction[]
    unblockUser: UnblockUser
    portfolio: Portfolio
    account: Account
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'close'
                  | 'kyc_applicant_created'
                  | 'on_deposit_tab_click'
                  | 'on_off_ramp_account_become_default'
                  | 'unblock_offramp_account_created'
          }
      >
    | Extract<
          MsgOf<typeof SubmitTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'kyc_applicant_created'
                  | 'on_contact_support_clicked'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_withdrawal_monitor_fiat_transaction_start'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
          }
      >

type State =
    | { type: 'form' }
    | { type: 'submit_transaction'; form: WithdrawalRequest }

export const WithdrawalForm = ({
    currencies,
    loginInfo,
    bankTransferInfo,
    onMsg,
    account,
    portfolio,
    offRampTransactions,
    offRampAccounts,
    accountsMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    installationId,
    sessionPassword,
    network,
    unblockUser,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    unblockUser={unblockUser}
                    currencies={currencies}
                    unblockLoginInfo={loginInfo}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    offRampTransactions={offRampTransactions}
                    portfolio={portfolio}
                    account={account}
                    keyStoreMap={keystoreMap}
                    network={network}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_deposit_tab_click':
                            case 'unblock_offramp_account_created':
                            case 'on_off_ramp_account_become_default':
                            case 'kyc_applicant_created':
                                onMsg(msg)
                                break
                            case 'on_submit_form_click':
                                setState({
                                    type: 'submit_transaction',
                                    form: msg.form,
                                })
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
                <SubmitTransaction
                    unblockUser={unblockUser}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    bankTransferCurrencies={currencies}
                    feePresetMap={feePresetMap}
                    bankTransferInfo={bankTransferInfo}
                    unblockLoginInfo={loginInfo}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    withdrawalRequest={state.form}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'import_keys_button_clicked':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_withdrawal_monitor_fiat_transaction_start':
                            case 'on_withdrawal_monitor_fiat_transaction_success':
                            case 'on_4337_gas_currency_selected':
                            case 'kyc_applicant_created':
                            case 'on_contact_support_clicked':
                                onMsg(msg)
                                break

                            case 'crypto_transaction_submitted':
                                // TODO :: do we want to do something here?
                                break

                            case 'on_minimize_click':
                            case 'transaction_failure_accepted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'on_close_transaction_status_not_found_modal':
                                setState({ type: 'form' })
                                break

                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'transaction_cancel_success':
                            case 'transaction_request_replaced':
                                // We do not want a widget for the crypto transaction, since the withdrawal itself is tracked already
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
