import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { NetworkMap } from '@zeal/domains/Network'
import { BankTransferInfo } from '@zeal/domains/Storage'

import { Flow } from './Flow'

type Props = {
    bankTransferInfo: BankTransferInfo
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Flow>

export const DepositMonitorWidget = ({
    bankTransferInfo,
    networkMap,
    onMsg,
}: Props) => {
    switch (bankTransferInfo.type) {
        case 'not_started':
            return null
        case 'unblock_user_created':
        case 'bank_transfer_unblock_user_created_for_safe_wallet':
            return (
                <Flow
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
