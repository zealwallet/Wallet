import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { FailedSimulation } from './FailedSimulation'
import { Simulation } from './Simulation'
import { SimulationNotSupported } from './SimulationNotSupported'

type Props = {
    actionSource: ActionSource
    transactionRequest: NotSigned
    simulation: SimulationResult
    nonce: number
    gasEstimate: string
    installationId: string

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap

    state: State

    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof Simulation>
    | MsgOf<typeof FailedSimulation>
    | MsgOf<typeof SimulationNotSupported>

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Flow = ({
    accounts,
    keystores,
    nonce,
    gasEstimate,
    simulation,
    state,
    transactionRequest,
    networkMap,
    networkRPCMap,
    feePresetMap,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    switch (simulation.type) {
        case 'failed':
            return (
                <FailedSimulation
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    keystoreMap={keystores}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    transactionRequest={transactionRequest}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'not_supported':
            return (
                <SimulationNotSupported
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    gasEstimate={gasEstimate}
                    keystoreMap={keystores}
                    nonce={nonce}
                    transactionRequest={transactionRequest}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        case 'simulated':
            return (
                <Simulation
                    installationId={installationId}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accounts={accounts}
                    keystores={keystores}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    state={state}
                    transactionRequest={transactionRequest}
                    actionSource={actionSource}
                    simulation={simulation.simulation}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(simulation)
    }
}
