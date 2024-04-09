import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import {
    KycStatus,
    OnRampTransactionEvent,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { fetchLastEventForOnRamp } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchLastEventForOnRamp'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { fetchUser } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchUser'
import { useCaptureErrorOnce } from '@zeal/domains/Error/hooks/useCaptureErrorOnce'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Layout } from './Layout'

const fetch = async ({
    bankTransferInfo,
    signal,
    bankTransferCurrencies,
    previousEvent,
}: {
    bankTransferInfo: BankTransferUnblockUserCreated
    previousEvent: OnRampTransactionEvent
    bankTransferCurrencies: BankTransferCurrencies
    signal?: AbortSignal
}): Promise<{
    transactionEvent: OnRampTransactionEvent
    kycStatus: KycStatus
}> => {
    const [user, transactionEvent] = await Promise.all([
        fetchUser({
            bankTransferInfo,
            signal,
        }),
        fetchLastEventForOnRamp({
            bankTransferCurrencies,
            bankTransferInfo,
            previousEvent,
            signal,
        }),
    ])

    return {
        kycStatus: user.kycStatus,
        transactionEvent,
    }
}

type Props = {
    network: Network
    account: Account
    networkMap: NetworkMap
    keyStoreMap: KeyStoreMap
    previousEvent: OnRampTransactionEvent
    form: OnRampFeeParams
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Layout>

// TODO @resetko-zeal extract this as separate feature
export const MonitoringOnRampInProgress = ({
    onMsg,
    account,
    keyStoreMap,
    network,
    form,
    bankTransferCurrencies,
    bankTransferInfo,
    previousEvent,
    unblockUser,
    networkMap,
}: Props) => {
    const captureErrorOnce = useCaptureErrorOnce()
    const [startedAt] = useState<number>(Date.now())
    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const [pollable] = usePollableData(
        fetch,
        {
            type: 'loading',
            params: {
                bankTransferCurrencies,
                bankTransferInfo,
                previousEvent,
            },
        },
        {
            stopIf: () => false,
            pollIntervalMilliseconds: 5000,
        }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                break
            case 'error':
                captureErrorOnce(pollable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [captureErrorOnce, pollable])

    switch (pollable.type) {
        case 'error':
        case 'loading':
            return (
                <Layout
                    networkMap={networkMap}
                    now={now}
                    startedAt={startedAt}
                    knownCurrencies={bankTransferCurrencies.knownCurrencies}
                    form={form}
                    onRampTransactionEvent={pollable.params.previousEvent}
                    keyStatus={unblockUser.kycStatus}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={onMsg}
                />
            )

        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    networkMap={networkMap}
                    now={now}
                    startedAt={startedAt}
                    knownCurrencies={bankTransferCurrencies.knownCurrencies}
                    form={form}
                    onRampTransactionEvent={pollable.data.transactionEvent}
                    keyStatus={pollable.data.kycStatus}
                    account={account}
                    keyStoreMap={keyStoreMap}
                    network={network}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
