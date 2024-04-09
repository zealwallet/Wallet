import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KycFailedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycFailedModal'
import { KycPausedModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPausedModal'
import { KycPendingModal } from '@zeal/domains/Currency/domains/BankTransfer/components/KycPendingModal'
import { Kyc } from '@zeal/domains/Currency/domains/BankTransfer/features/KYC'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { SelectCurrency } from './SelectCurrency'

import { FiatCurrencySelector } from '../../../../FiatCurrencySelector'
import { KycModal } from '../../../KycModal'
import { TransferFeesModal } from '../../../TransferFeesModal'
import { TransferTimeModal } from '../../../TransferTimeModal'
import { DepositPollable } from '../validation'

type Props = {
    state: State
    pollable: DepositPollable
    currencies: BankTransferCurrencies
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    unblockUser: UnblockUser
    bankTransferInfo: BankTransferUnblockUserCreated
    loginInfo: UnblockLoginInfo
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof FiatCurrencySelector>
    | Extract<MsgOf<typeof KycModal>, { type: 'on_get_started_clicked' }>
    | Extract<
          MsgOf<typeof Kyc>,
          { type: 'kyc_applicant_created' | 'kyc_data_updated' }
      >
    | Extract<
          MsgOf<typeof KycPausedModal>,
          { type: 'on_kyc_try_again_clicked' }
      >
    | Extract<
          MsgOf<typeof SelectCurrency>,
          { type: 'user_bank_verification_number_successfully_set' }
      >

export type State =
    | { type: 'closed' }
    | { type: 'currency_selector' }
    | { type: 'transfer_fee_info' }
    | { type: 'transfer_time_info' }
    | { type: 'request_KYC' }
    | { type: 'KYC_process' }

export const Modal = ({
    state,
    pollable,
    onMsg,
    account,
    network,
    keyStoreMap,
    currencies,
    unblockUser,
    loginInfo,
    bankTransferInfo,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'currency_selector':
            return (
                <UIModal>
                    <SelectCurrency
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        loginInfo={loginInfo}
                        bankTransferInfo={bankTransferInfo}
                        pollable={pollable}
                        unblockUser={unblockUser}
                        currencies={currencies}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'transfer_fee_info':
            return (
                <TransferFeesModal
                    onMsg={onMsg}
                    knownCurrencies={currencies.knownCurrencies}
                    pollable={pollable}
                />
            )

        case 'transfer_time_info':
            return <TransferTimeModal onMsg={onMsg} />

        case 'request_KYC':
            const { kycStatus } = unblockUser
            switch (kycStatus.type) {
                case 'not_started':
                    return <KycModal onMsg={onMsg} />
                case 'approved':
                    return null
                case 'paused':
                    return <KycPausedModal onMsg={onMsg} />
                case 'failed':
                    return <KycFailedModal onMsg={onMsg} />
                case 'in_progress':
                    return <KycPendingModal onMsg={onMsg} />
                /* istanbul ignore next */
                default:
                    return notReachable(kycStatus)
            }

        case 'KYC_process':
            return (
                <UIModal>
                    <Kyc
                        account={account}
                        network={network}
                        keyStoreMap={keyStoreMap}
                        bankTransferInfo={bankTransferInfo}
                        loginInfo={loginInfo}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'on_back_button_clicked':
                                case 'on_do_bank_transfer_clicked':
                                    onMsg({ type: 'close' })
                                    break
                                case 'kyc_data_updated':
                                case 'kyc_applicant_created':
                                    onMsg(msg)
                                    break

                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
