import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
    fetchFeeForecast,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { DEFAULT_SPEEDUP_FEE_PRESET } from '@zeal/domains/Transactions/constants'

import { Layout, Msg as LayoutMsg } from './Layout'
import { Skeleton } from './Skeleton'

type Props = {
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    keyStore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | Extract<LayoutMsg, { type: 'confirm_speed_up_click' | 'close' }>

const POLLING_INTERVAL_MS = 5000

export const DataLoader = ({
    transactionRequest,
    networkMap,
    networkRPCMap,
    onMsg,
    source,
    keyStore,
    installationId,
}: Props) => {
    const [pollable, setPollable] = usePollableData<
        FeeForecastResponse,
        FeeForecastRequest
    >(
        fetchFeeForecast,
        {
            type: 'loading',
            params: {
                selectedPreset: DEFAULT_SPEEDUP_FEE_PRESET,
                address: transactionRequest.account.address,
                gasLimit: transactionRequest.selectedGas,
                network: findNetworkByHexChainId(
                    transactionRequest.networkHexId,
                    networkMap
                ),
                networkRPCMap,
                gasEstimate: transactionRequest.gasEstimate,
                sendTransactionRequest: transactionRequest.rpcRequest,
            },
        },
        {
            pollIntervalMilliseconds: POLLING_INTERVAL_MS,
        }
    )

    switch (pollable.type) {
        case 'loading':
            return <Skeleton onMsg={onMsg} />

        case 'reloading':
        case 'subsequent_failed':
        case 'loaded':
            return (
                <Layout
                    source={source}
                    keyStore={keyStore}
                    installationId={installationId}
                    transactionRequest={transactionRequest}
                    pollingInterval={POLLING_INTERVAL_MS}
                    pollable={pollable}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'confirm_speed_up_click':
                                onMsg(msg)
                                break
                            case 'on_reload_click':
                                setPollable({
                                    type: 'reloading',
                                    data: msg.data,
                                    params: msg.params,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'error':
            return (
                <AppErrorPopup
                    error={parseAppError(pollable.error)}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break

                            case 'try_again_clicked':
                                setPollable({
                                    type: 'loading',
                                    params: pollable.params,
                                })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(pollable)
    }
}
