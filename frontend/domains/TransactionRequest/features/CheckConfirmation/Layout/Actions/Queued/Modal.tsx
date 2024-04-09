import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { SubmitedQueued } from '@zeal/domains/TransactionRequest'
import { SimulateCancel } from '@zeal/domains/TransactionRequest/features/SimulateCancel'
import { SpeedUp } from '@zeal/domains/Transactions/features/Speedup'

export type State =
    | { type: 'closed' }
    | { type: 'speedup_transaction' }
    | { type: 'cancel_transaction' }

type Props = {
    state: State
    transactionRequest: SubmitedQueued
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    keyStore: KeyStore
    installationId: string
    source: components['schemas']['TransactionEventSource']
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof SpeedUp> | MsgOf<typeof SimulateCancel>

export const Modal = ({
    state,
    transactionRequest,
    networkMap,
    networkRPCMap,
    keyStore,
    source,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'speedup_transaction':
            return (
                <SpeedUp
                    source={source}
                    keyStore={keyStore}
                    installationId={installationId}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        case 'cancel_transaction':
            return (
                <SimulateCancel
                    source={source}
                    keyStore={keyStore}
                    installationId={installationId}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
