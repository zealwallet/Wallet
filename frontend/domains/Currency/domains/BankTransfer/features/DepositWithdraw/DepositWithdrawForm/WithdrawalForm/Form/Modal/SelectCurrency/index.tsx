import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import { FiatCurrency } from '@zeal/domains/Currency'
import { OffRampAccount } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { CreateBankAccount } from './CreateBankAccount'
import { MakeOffRampAccountDefault } from './MakeOffRampAccountDefault'

import { FiatCurrencySelector } from '../../../../../FiatCurrencySelector'
import { SubmitCreateAccount } from '../../../../../SetupOfframpBankAccount/SubmitCreateAccount'

type Props = {
    currencies: BankTransferCurrencies
    offRampAccounts: OffRampAccount[]
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockLoginInfo: UnblockLoginInfo
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    selectedCurrency: FiatCurrency | null

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof SubmitCreateAccount>,
          { type: 'unblock_offramp_account_created' }
      >
    | Extract<
          MsgOf<typeof MakeOffRampAccountDefault>,
          { type: 'on_off_ramp_account_become_default' }
      >

type State =
    | { type: 'select_currency' }
    | { type: 'create_off_ramp_account'; currency: FiatCurrency }
    | {
          type: 'make_selected_account_default_one'
          offRampAccount: OffRampAccount
      }

export const SelectCurrency = ({
    currencies,
    offRampAccounts,
    unblockLoginInfo,
    bankTransferInfo,
    account,
    keyStoreMap,
    network,
    selectedCurrency,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_currency' })

    switch (state.type) {
        case 'select_currency':
            return (
                <FiatCurrencySelector
                    fiatCurrencies={values(currencies.fiatCurrencies)}
                    selected={selectedCurrency}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_currency_selected':
                                const account = offRampAccounts.find(
                                    (account) => {
                                        return account.currency === msg.currency
                                    }
                                )

                                if (!account) {
                                    setState({
                                        type: 'create_off_ramp_account',
                                        currency: msg.currency,
                                    })
                                } else {
                                    setState({
                                        type: 'make_selected_account_default_one',
                                        offRampAccount: account,
                                    })
                                }
                                break

                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'create_off_ramp_account':
            return (
                <CreateBankAccount
                    bankTransferCurrencies={currencies}
                    unblockLoginInfo={unblockLoginInfo}
                    currency={state.currency}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'select_currency' })
                                break

                            case 'unblock_offramp_account_created':
                                onMsg(msg)

                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'make_selected_account_default_one':
            return (
                <MakeOffRampAccountDefault
                    bankTransferInfo={bankTransferInfo}
                    unblockLoginInfo={unblockLoginInfo}
                    offRampAccount={state.offRampAccount}
                    onMsg={onMsg}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
