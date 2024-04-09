import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { SubmitedTransactionQueued } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/api/fetchTransaction'

import { Layout } from './Layout'

import { TopUpRequest } from '../TopUpRequest'

type Props = {
    topUpRequest: TopUpRequest
    knownCurrencies: KnownCurrencies | null
    topUpCurrencies: CryptoCurrency[]
    submittedTransaction: SubmitedTransactionQueued
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Layout>

const TRANSACTION_POLL_INTERVAL_MS = 1000

export const MonitorTransaction = ({
    submittedTransaction,
    topUpCurrencies,
    knownCurrencies,
    topUpRequest,
    onMsg,
}: Props) => {
    const [pollable] = usePollableData(
        fetchTransaction,
        {
            type: 'loading',
            params: {
                transaction: submittedTransaction,
                network: topUpRequest.network,
                account: topUpRequest.fromAccount,
                networkRPCMap: {},
            },
        },
        {
            pollIntervalMilliseconds: TRANSACTION_POLL_INTERVAL_MS,
            stopIf: (pollable) => {
                switch (pollable.type) {
                    case 'loading':
                    case 'error':
                        return false
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        switch (pollable.data.state) {
                            case 'queued':
                            case 'included_in_block':
                                return false
                            case 'completed':
                            case 'failed':
                            case 'replaced':
                                return true
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data)
                        }
                    /* istanbul ignore next */
                    default:
                        return notReachable(pollable)
                }
            },
        }
    )

    switch (pollable.type) {
        case 'loading':
        case 'error':
            return (
                <Layout
                    knownCurrencies={knownCurrencies}
                    submittedTransaction={pollable.params.transaction}
                    topUpCurrencies={topUpCurrencies}
                    topUpRequest={topUpRequest}
                    onMsg={onMsg}
                />
            )
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Layout
                    knownCurrencies={knownCurrencies}
                    submittedTransaction={pollable.data}
                    topUpCurrencies={topUpCurrencies}
                    topUpRequest={topUpRequest}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}
