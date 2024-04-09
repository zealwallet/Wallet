import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    KycStatus,
    OnRampTransactionOnHoldKycEvent,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { NetworkMap } from '@zeal/domains/Network'

import { KycFailed } from './KycFailed'
import { KycInProgressOrApproved } from './KycInProgressOrApproved'
import { KycNotStarted } from './KycNotStarted'
import { KycPaused } from './KycPaused'

type Props = {
    networkMap: NetworkMap
    event: OnRampTransactionOnHoldKycEvent
    kycStatus: KycStatus
    now: number
    startedAt: number
    form: OnRampFeeParams
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof KycPaused>
    | MsgOf<typeof KycFailed>
    | MsgOf<typeof KycInProgressOrApproved>
    | MsgOf<typeof KycNotStarted>

export const OnHoldKyc = ({
    event,
    form,
    knownCurrencies,
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
                    event={event}
                    form={form}
                    knownCurrencies={knownCurrencies}
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
                    event={event}
                    form={form}
                    knownCurrencies={knownCurrencies}
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
                    event={event}
                    form={form}
                    knownCurrencies={knownCurrencies}
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
                    event={event}
                    form={form}
                    knownCurrencies={knownCurrencies}
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
