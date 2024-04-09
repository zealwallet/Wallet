import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import { FiatCurrency } from '@zeal/domains/Currency'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { SetUserBankVerificationNumber } from './SetUserBankVerificationNumber'

import { FiatCurrencySelector } from '../../../../../FiatCurrencySelector'
import { DepositPollable } from '../../validation'

type Props = {
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    pollable: DepositPollable
    unblockUser: UnblockUser
    currencies: BankTransferCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | MsgOf<typeof FiatCurrencySelector>
    | MsgOf<typeof SetUserBankVerificationNumber>

type State =
    | { type: 'select_currency' }
    | { type: 'set_user_bvn'; currency: FiatCurrency }

export const SelectCurrency = ({
    pollable,
    currencies,
    unblockUser,
    account,
    network,
    keyStoreMap,
    bankTransferInfo,
    loginInfo,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_currency' })

    switch (state.type) {
        case 'select_currency':
            return (
                <FiatCurrencySelector
                    selected={pollable.params.form.inputCurrency}
                    fiatCurrencies={values(currencies.fiatCurrencies)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_currency_selected':
                                switch (msg.currency.code) {
                                    case 'NGN': {
                                        unblockUser.bankVerificationNumber
                                            ? onMsg(msg)
                                            : setState({
                                                  type: 'set_user_bvn',
                                                  currency: msg.currency,
                                              })
                                        break
                                    }
                                    default:
                                        onMsg(msg)
                                }
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'set_user_bvn':
            return (
                <SetUserBankVerificationNumber
                    account={account}
                    network={network}
                    currency={state.currency}
                    loginInfo={loginInfo}
                    bankTransferInfo={bankTransferInfo}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'select_currency' })
                                break
                            case 'user_bank_verification_number_successfully_set':
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
