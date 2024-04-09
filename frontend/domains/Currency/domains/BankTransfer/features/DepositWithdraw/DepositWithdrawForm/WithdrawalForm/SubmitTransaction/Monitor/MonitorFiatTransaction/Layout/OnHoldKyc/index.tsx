import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import {
    KycStatus,
    OffRampOnHoldKycEvent,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { Network, NetworkMap } from '@zeal/domains/Network'

import { KycFailed } from './KycFailed'
import { KycInProgressOrApproved } from './KycInProgressOrApproved'
import { KycNotStarted } from './KycNotStarted'
import { KycPaused } from './KycPaused'

type Props = {
    kycStatus: KycStatus

    networkMap: NetworkMap
    offRampTransactionEvent: OffRampOnHoldKycEvent
    withdrawalRequest: WithdrawalRequest
    network: Network
    transactionHash: string
    now: number
    startedAt: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof KycPaused>
    | MsgOf<typeof KycFailed>
    | MsgOf<typeof KycInProgressOrApproved>
    | MsgOf<typeof KycNotStarted>

export const OnHoldKyc = ({
    network,
    offRampTransactionEvent,
    transactionHash,
    withdrawalRequest,
    kycStatus,
    networkMap,
    now,
    startedAt,
    onMsg,
}: Props) => {
    switch (kycStatus.type) {
        case 'paused':
            return (
                <KycPaused
                    network={network}
                    offRampTransactionEvent={offRampTransactionEvent}
                    transactionHash={transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    kycStatus={kycStatus}
                    networkMap={networkMap}
                    now={now}
                    onMsg={onMsg}
                    startedAt={startedAt}
                />
            )

        case 'not_started':
            return (
                <KycNotStarted
                    network={network}
                    offRampTransactionEvent={offRampTransactionEvent}
                    transactionHash={transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    kycStatus={kycStatus}
                    networkMap={networkMap}
                    now={now}
                    onMsg={onMsg}
                    startedAt={startedAt}
                />
            )

        case 'failed':
            return (
                <KycFailed
                    network={network}
                    offRampTransactionEvent={offRampTransactionEvent}
                    transactionHash={transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    kycStatus={kycStatus}
                    networkMap={networkMap}
                    now={now}
                    onMsg={onMsg}
                    startedAt={startedAt}
                />
            )

        case 'approved':
        case 'in_progress':
            return (
                <KycInProgressOrApproved
                    network={network}
                    offRampTransactionEvent={offRampTransactionEvent}
                    transactionHash={transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    kycStatus={kycStatus}
                    networkMap={networkMap}
                    now={now}
                    onMsg={onMsg}
                    startedAt={startedAt}
                />
            )

        default:
            return notReachable(kycStatus)
    }
}
