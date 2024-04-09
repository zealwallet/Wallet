import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    OffRampTransaction,
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { DepositForm } from './DepositForm'
import { WithdrawalForm } from './WithdrawalForm'

type Props = {
    portfolio: Portfolio
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    installationId: string
    sessionPassword: string
    network: Network
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    offRampAccounts: OffRampAccount[]
    offRampTransactions: OffRampTransaction[]
    onRampTransactions: OnRampTransaction[]
    account: Account
    currencies: BankTransferCurrencies
    unblockUser: UnblockUser
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof WithdrawalForm>,
          {
              type:
                  | 'close'
                  | 'import_keys_button_clicked'
                  | 'on_off_ramp_account_become_default'
                  | 'unblock_offramp_account_created'
                  | 'kyc_applicant_created'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_withdrawal_monitor_fiat_transaction_start'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
          }
      >
    | Extract<
          MsgOf<typeof DepositForm>,
          {
              type:
                  | 'close'
                  | 'on_on_ramp_transfer_success_close_click'
                  | 'kyc_applicant_created'
                  | 'user_bank_verification_number_successfully_set'
                  | 'on_contact_support_clicked'
          }
      >

type State = { type: 'deposit' | 'withdrawal' }

export const Form = ({
    accountsMap,
    portfolio,
    keystoreMap,
    networkMap,
    networkRPCMap,
    installationId,
    sessionPassword,
    network,
    unblockLoginInfo,
    bankTransferInfo,
    offRampAccounts,
    offRampTransactions,
    onRampTransactions,
    account,
    currencies,
    onMsg,
    feePresetMap,
    unblockUser,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'deposit' })

    switch (state.type) {
        case 'deposit':
            return (
                <DepositForm
                    networkMap={networkMap}
                    currencies={currencies}
                    unblockUser={unblockUser}
                    network={network}
                    keyStoreMap={keystoreMap}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    onRampTransactions={onRampTransactions}
                    portfolio={portfolio}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_on_ramp_transfer_success_close_click':
                            case 'kyc_applicant_created':
                            case 'user_bank_verification_number_successfully_set':
                            case 'on_contact_support_clicked':
                                onMsg(msg)
                                break
                            case 'on_withdraw_tab_click':
                                setState({ type: 'withdrawal' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'withdrawal':
            return (
                <WithdrawalForm
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    unblockUser={unblockUser}
                    feePresetMap={feePresetMap}
                    currencies={currencies}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    network={network}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    loginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    offRampTransactions={offRampTransactions}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'kyc_applicant_created':
                            case 'on_off_ramp_account_become_default':
                            case 'unblock_offramp_account_created':
                            case 'import_keys_button_clicked':
                            case 'close':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_withdrawal_monitor_fiat_transaction_start':
                            case 'on_withdrawal_monitor_fiat_transaction_success':
                            case 'on_4337_gas_currency_selected':
                            case 'on_contact_support_clicked':
                                onMsg(msg)
                                break
                            case 'on_deposit_tab_click':
                                setState({ type: 'deposit' })
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
            return notReachable(state.type)
    }
}
