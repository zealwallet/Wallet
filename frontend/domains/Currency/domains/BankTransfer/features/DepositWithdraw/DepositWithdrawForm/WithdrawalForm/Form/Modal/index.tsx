import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { FiatCurrency } from '@zeal/domains/Currency'
import {
    OffRampAccount,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
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

import { KycModal } from '../../../KycModal'
import { TransferFeesModal } from '../../../TransferFeesModal'
import { TransferTimeModal } from '../../../TransferTimeModal'
import { WithdrawPollable } from '../validation'

type Props = {
    pollable: WithdrawPollable
    state: State
    currencies: BankTransferCurrencies
    offRampAccounts: OffRampAccount[]
    // withdrawalRequest: WithdrawalRequest
    bankTransferInfo: BankTransferUnblockUserCreated
    unblockUser: UnblockUser
    unblockLoginInfo: UnblockLoginInfo
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    selectedCurrency: FiatCurrency | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof SelectCurrency>
    | MsgOf<typeof KycModal>
    | Extract<
          MsgOf<typeof Kyc>,
          { type: 'kyc_applicant_created' | 'kyc_data_updated' }
      >
    | Extract<
          MsgOf<typeof KycPausedModal>,
          { type: 'on_kyc_try_again_clicked' }
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
    currencies,
    unblockLoginInfo,
    bankTransferInfo,
    account,
    keyStoreMap,
    network,
    offRampAccounts,
    selectedCurrency,
    unblockUser,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'currency_selector':
            return (
                <UIModal>
                    <SelectCurrency
                        currencies={currencies}
                        unblockLoginInfo={unblockLoginInfo}
                        selectedCurrency={selectedCurrency}
                        bankTransferInfo={bankTransferInfo}
                        account={account}
                        keyStoreMap={keyStoreMap}
                        network={network}
                        offRampAccounts={offRampAccounts}
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
                        loginInfo={unblockLoginInfo}
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
