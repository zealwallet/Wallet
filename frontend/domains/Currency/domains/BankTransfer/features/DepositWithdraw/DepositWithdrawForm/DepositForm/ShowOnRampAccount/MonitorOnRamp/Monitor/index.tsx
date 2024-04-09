import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    OnRampTransactionEvent,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Modal, State as ModalState } from './Modal'
import { MonitoringOnRampInProgress as Layout } from './MonitoringOnRampInProgress'

type Props = {
    unblockLoginInfo: UnblockLoginInfo
    network: Network
    account: Account
    keyStoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    networkMap: NetworkMap
    previousEvent: OnRampTransactionEvent
    form: OnRampFeeParams
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
                  | 'on_on_ramp_transfer_success_close_click'
                  | 'on_contact_support_clicked'
          }
      >

export const Monitor = ({
    onMsg,
    account,
    bankTransferInfo,
    keyStoreMap,
    network,
    unblockLoginInfo,
    bankTransferCurrencies,
    form,
    networkMap,
    previousEvent,
    unblockUser,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                form={form}
                keyStoreMap={keyStoreMap}
                network={network}
                networkMap={networkMap}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_on_ramp_transfer_success_close_click':
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
                previousEvent={previousEvent}
                unblockUser={unblockUser}
                account={account}
                bankTransferCurrencies={bankTransferCurrencies}
                bankTransferInfo={bankTransferInfo}
            />

            <Modal
                state={modal}
                account={account}
                bankTransferInfo={bankTransferInfo}
                keyStoreMap={keyStoreMap}
                network={network}
                unblockLoginInfo={unblockLoginInfo}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                        case 'on_back_button_clicked':
                        case 'kyc_data_updated':
                        case 'on_do_bank_transfer_clicked':
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
