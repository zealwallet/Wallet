import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Modal, State as ModalState } from './Modal'
import { MonitorFiatTransaction as Layout } from './MonitorFiatTransaction'

type Props = {
    account: Account
    network: Network
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    loginInfo: UnblockLoginInfo
    transactionHash: string
    withdrawalRequest: WithdrawalRequest
    bankTransferCurrencies: BankTransferCurrencies
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Modal>, { type: 'kyc_applicant_created' }>
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'close'
                  | 'on_withdrawal_monitor_fiat_transaction_start'
                  | 'on_withdrawal_monitor_fiat_transaction_success'
                  | 'on_contact_support_clicked'
          }
      >

export const Monitor = ({
    account,
    bankTransferCurrencies,
    bankTransferInfo,
    keyStoreMap,
    loginInfo,
    network,
    networkMap,
    transactionHash,
    withdrawalRequest,
    unblockUser,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                unblockUser={unblockUser}
                account={account}
                bankTransferCurrencies={bankTransferCurrencies}
                bankTransferInfo={bankTransferInfo}
                keyStoreMap={keyStoreMap}
                network={network}
                networkMap={networkMap}
                transactionHash={transactionHash}
                withdrawalRequest={withdrawalRequest}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_withdrawal_monitor_fiat_transaction_start':
                        case 'on_withdrawal_monitor_fiat_transaction_success':
                        case 'on_contact_support_clicked':
                            onMsg(msg)
                            break

                        case 'on_kyc_try_again_clicked':
                        case 'on_kyc_start_verification_clicked':
                            setModal({ type: 'kyc_process' })
                            break

                        default:
                            return notReachable(msg)
                    }
                }}
            />

            <Modal
                state={modal}
                account={account}
                bankTransferInfo={bankTransferInfo}
                keyStoreMap={keyStoreMap}
                network={network}
                unblockLoginInfo={loginInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_back_button_clicked':
                        case 'on_do_bank_transfer_clicked':
                        case 'kyc_data_updated':
                            setModal({ type: 'closed' })
                            break

                        case 'kyc_applicant_created':
                            onMsg(msg)
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}
