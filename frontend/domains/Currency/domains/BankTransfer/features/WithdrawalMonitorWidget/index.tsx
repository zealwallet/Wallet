import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SubmittedOfframpTransaction } from '@zeal/domains/Currency/domains/BankTransfer'
import { NetworkMap } from '@zeal/domains/Network'
import { BankTransferInfo } from '@zeal/domains/Storage'

import { DataLoader } from './DataLoader'

type Props = {
    bankTransferInfo: BankTransferInfo
    submittedTransaction: SubmittedOfframpTransaction
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof DataLoader>

export const WithdrawalMonitorWidget = ({
    bankTransferInfo,
    networkMap,
    submittedTransaction,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null
        case 'unblock_user_created':
        case 'bank_transfer_unblock_user_created_for_safe_wallet':
            return (
                <DataLoader
                    submittedTransaction={submittedTransaction}
                    networkMap={networkMap}
                    bankTransferInfo={bankTransferInfo}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(bankTransferInfo)
    }
}
