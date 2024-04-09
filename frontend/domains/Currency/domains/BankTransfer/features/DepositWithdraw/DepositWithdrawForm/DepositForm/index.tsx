import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    OffRampAccount,
    OnRampTransaction,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Form } from './Form'
import { ShowOnRampAccount } from './ShowOnRampAccount'

type Props = {
    offRampAccounts: OffRampAccount[]
    onRampTransactions: OnRampTransaction[]
    network: Network
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    unblockUser: UnblockUser
    portfolio: Portfolio
    account: Account
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    currencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof Form>,
          {
              type:
                  | 'on_withdraw_tab_click'
                  | 'kyc_applicant_created'
                  | 'user_bank_verification_number_successfully_set'
                  | 'close'
          }
      >
    | Extract<
          MsgOf<typeof ShowOnRampAccount>,
          {
              type:
                  | 'on_on_ramp_transfer_success_close_click'
                  | 'on_contact_support_clicked'
          }
      >

type State =
    | { type: 'form' }
    | { type: 'show_on_ramp_account'; form: OnRampFeeParams }

export const DepositForm = ({
    offRampAccounts,
    onRampTransactions,
    account,
    unblockUser,
    onMsg,
    portfolio,
    network,
    keyStoreMap,
    networkMap,
    bankTransferInfo,
    currencies,
    unblockLoginInfo,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })
    switch (state.type) {
        case 'form':
            return (
                <Form
                    loginInfo={unblockLoginInfo}
                    currencies={currencies}
                    unblockUser={unblockUser}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    bankTransferInfo={bankTransferInfo}
                    offRampAccounts={offRampAccounts}
                    onRampTransactions={onRampTransactions}
                    portfolio={portfolio}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_withdraw_tab_click':
                            case 'kyc_applicant_created':
                            case 'user_bank_verification_number_successfully_set':
                                onMsg(msg)
                                break
                            case 'on_submit_form_click':
                                setState({
                                    type: 'show_on_ramp_account',
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
        case 'show_on_ramp_account':
            return (
                <ShowOnRampAccount
                    networkMap={networkMap}
                    unblockUser={unblockUser}
                    currencies={currencies}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    account={account}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    form={state.form}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_on_ramp_transfer_success_close_click':
                            case 'on_contact_support_clicked':
                            case 'kyc_applicant_created':
                                onMsg(msg)
                                break

                            case 'on_back_button_clicked':
                                setState({ type: 'form' })
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
