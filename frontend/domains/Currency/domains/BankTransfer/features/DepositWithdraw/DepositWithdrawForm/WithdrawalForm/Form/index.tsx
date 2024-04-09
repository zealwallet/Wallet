import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    OffRampAccount,
    OffRampTransaction,
    UnblockTransferFee,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import {
    fetchTransactionFee,
    OffRampFeeParams,
} from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { fetchUnblockFXRate } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUnblockFXRate'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    currencies: BankTransferCurrencies
    unblockLoginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    offRampAccounts: OffRampAccount[]
    offRampTransactions: OffRampTransaction[]
    portfolio: Portfolio
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_deposit_tab_click' | 'on_submit_form_click' }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'unblock_offramp_account_created'
                  | 'on_off_ramp_account_become_default'
          }
      >
    | Extract<MsgOf<typeof Modal>, { type: 'kyc_applicant_created' }>

const calculateInitialForm = ({
    offRampAccounts,
    currencies,
}: {
    offRampAccounts: OffRampAccount[]
    currencies: BankTransferCurrencies
}): OffRampFeeParams => {
    if (offRampAccounts.length === 0) {
        throw new ImperativeError('No offramp accounts for withdrawal')
    }

    const defaultAccount = offRampAccounts.find(
        (account) => account.mainBeneficiary
    )

    if (!defaultAccount) {
        throw new ImperativeError('No default offramp account for withdrawal')
    }

    return {
        type: 'cryptoToFiat',
        inputCurrency: currencies.defaultCryptoCurrency,
        outputCurrency: defaultAccount.currency,
        amount: null,
    }
}

export type OffRampFeeResponse = {
    rate: FXRate
    fee: UnblockTransferFee
}

export const fetch = ({
    form,
    bankTransferInfo,
    signal,
}: {
    form: OffRampFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    signal?: AbortSignal
}): Promise<OffRampFeeResponse> => {
    return Promise.all([
        fetchUnblockFXRate({
            feeParams: form,
            bankTransferInfo,
            signal,
        }),
        fetchTransactionFee({ feeParams: form, bankTransferInfo, signal }),
    ]).then(([rate, fee]) => ({ rate, fee }))
}

export const Form = ({
    currencies,
    unblockLoginInfo,
    bankTransferInfo,
    offRampAccounts,
    offRampTransactions,
    account,
    portfolio,
    keyStoreMap,
    network,
    unblockUser,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({
        type: 'closed',
    })

    const [pollable, setPollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                form: calculateInitialForm({ offRampAccounts, currencies }),
                unblockLoginInfo,
                bankTransferInfo: bankTransferInfo,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 30000,
        }
    )

    return (
        <>
            <Layout
                unblockUser={unblockUser}
                currencies={currencies}
                pollable={pollable}
                network={network}
                keyStoreMap={keyStoreMap}
                portfolio={portfolio}
                account={account}
                offRampAccounts={offRampAccounts}
                offRampTransactions={offRampTransactions}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            onMsg(msg)
                            break
                        case 'on_amount_change':
                            setPollable({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        amount: msg.amount,
                                    },
                                },
                            })
                            break
                        case 'on_deposit_tab_click':
                            onMsg(msg)
                            break
                        case 'on_currency_selector_click':
                            setModal({ type: 'currency_selector' })
                            break
                        case 'on_fee_info_click':
                            setModal({
                                type: 'transfer_fee_info',
                            })
                            break
                        case 'on_time_info_click':
                            setModal({ type: 'transfer_time_info' })
                            break
                        case 'on_submit_form_click':
                            onMsg(msg)
                            break

                        case 'on_kyc_banner_click':
                            setModal({ type: 'request_KYC' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                unblockUser={unblockUser}
                currencies={currencies}
                selectedCurrency={pollable.params.form.outputCurrency}
                pollable={pollable}
                unblockLoginInfo={unblockLoginInfo}
                bankTransferInfo={bankTransferInfo}
                account={account}
                keyStoreMap={keyStoreMap}
                network={network}
                offRampAccounts={offRampAccounts}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'unblock_offramp_account_created':
                            setModal({ type: 'closed' })
                            setPollable((pollable) => ({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        outputCurrency: msg.account.currency,
                                    },
                                },
                            }))
                            onMsg(msg)
                            break

                        case 'on_off_ramp_account_become_default':
                            setModal({ type: 'closed' })
                            setPollable((pollable) => ({
                                type: 'loading',
                                params: {
                                    ...pollable.params,
                                    form: {
                                        ...pollable.params.form,
                                        outputCurrency:
                                            msg.offRampAccount.currency,
                                    },
                                },
                            }))
                            onMsg(msg)
                            break

                        case 'on_get_started_clicked':
                        case 'on_kyc_try_again_clicked':
                            setModal({ type: 'KYC_process' })
                            break
                        case 'kyc_applicant_created':
                            onMsg(msg)
                            break

                        case 'kyc_data_updated':
                            onMsg({ type: 'close' })
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
