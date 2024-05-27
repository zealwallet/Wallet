import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    OnRampAccount,
    OnRampTransactionEvent,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { CreateOnRampAccount } from './CreateOnRampAccount'
import { MonitorOnRamp } from './MonitorOnRamp'
import { ShowOnRampAccountDetails } from './ShowOnRampAccountDetails'

type Props = {
    currencies: BankTransferCurrencies
    onRampAccounts: OnRampAccount[]
    network: Network
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    account: Account
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    form: OnRampFeeParams
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof ShowOnRampAccountDetails>,
          { type: 'on_back_button_clicked' | 'close' }
      >
    | MsgOf<typeof MonitorOnRamp>

type State =
    | { type: 'show_on_ramp_details'; onRampAccount: OnRampAccount }
    | { type: 'monitor_onramp'; onRampEvent: OnRampTransactionEvent | null }
    | { type: 'create_on_ramp_account' }

const calculateState = (
    form: OnRampFeeParams,
    onRampAccounts: OnRampAccount[]
): State => {
    const selectedCurrencyAccount = onRampAccounts.find(
        (account) => account.currency.id === form.inputCurrency.id
    )

    return selectedCurrencyAccount
        ? {
              type: 'show_on_ramp_details',
              onRampAccount: selectedCurrencyAccount,
          }
        : { type: 'create_on_ramp_account' }
}

export const Flow = ({
    onRampAccounts,
    form,
    currencies,
    onMsg,
    network,
    unblockLoginInfo,
    bankTransferInfo,
    keyStoreMap,
    account,
    unblockUser,
    networkMap,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        calculateState(form, onRampAccounts)
    )
    switch (state.type) {
        case 'create_on_ramp_account':
            return (
                <CreateOnRampAccount
                    currencies={currencies}
                    unblockLoginInfo={unblockLoginInfo}
                    bankTransferInfo={bankTransferInfo}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    account={account}
                    form={form}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_ramp_account_created':
                                setState({
                                    type: 'show_on_ramp_details',
                                    onRampAccount: msg.onRampAccount,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'show_on_ramp_details':
            return (
                <ShowOnRampAccountDetails
                    bankTransferInfo={bankTransferInfo}
                    unblockUser={unblockUser}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    currencies={currencies}
                    onRampAccount={state.onRampAccount}
                    form={form}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sent_from_bank_click':
                                setState({
                                    type: 'monitor_onramp',
                                    onRampEvent: null,
                                })
                                break

                            case 'on_unfinished_onramp_found':
                                setState({
                                    type: 'monitor_onramp',
                                    onRampEvent: msg.event,
                                })
                                break

                            case 'close':
                                onMsg(msg)
                                break

                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'monitor_onramp':
            return (
                <MonitorOnRamp
                    unblockLoginInfo={unblockLoginInfo}
                    unblockUser={unblockUser}
                    event={state.onRampEvent}
                    networkMap={networkMap}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    bankTransferCurrencies={currencies}
                    form={form}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
