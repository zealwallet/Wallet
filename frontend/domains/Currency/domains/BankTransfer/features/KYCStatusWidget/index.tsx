import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { BankTransferInfo } from '@zeal/domains/Storage'

import { Flow } from './Flow'

type Props = {
    bankTransferInfo: BankTransferInfo
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

export const KYCStatusWidget = ({ bankTransferInfo, onMsg }: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null

        case 'unblock_user_created':
        case 'bank_transfer_unblock_user_created_for_safe_wallet':
            return bankTransferInfo.sumSubAccessToken ? (
                <Flow bankTransferInfo={bankTransferInfo} onMsg={onMsg} />
            ) : null

        default:
            return notReachable(bankTransferInfo)
    }
}
