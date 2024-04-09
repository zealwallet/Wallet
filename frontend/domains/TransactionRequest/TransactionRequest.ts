import { components } from '@zeal/api/portfolio'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { NetworkHexId } from '@zeal/domains/Network'
import {
    EthSendRawTransaction,
    EthSendTransaction,
} from '@zeal/domains/RPCRequest'
import {
    SubmitedTransaction,
    SubmitedTransactionQueued,
} from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { EstimatedFee } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

/**
 * Request from dApp, we catch it and pass EthSendTransaction as a parameter to simulation
 */
export type NotSigned = {
    state: 'not_signed'
    networkHexId: NetworkHexId
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction
}

/**
 * we got simulation from BE, and we preselect for user EstimatedFee.
 * Then we send this for signing and sending to RPC
 */
export type Simulated = {
    state: 'simulated'
    networkHexId: NetworkHexId
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction
    simulation: SimulationResult
    gasEstimate: string
    selectedFee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
    selectedGas: string
    selectedNonce: number
}

/**
 * After we have response from RPC we have submitedTransaction + rawTransaction which was sent
 * We can use this one to update `submitedTransaction` by polling RPC node
 */
export type Submited = {
    state: 'submited'
    networkHexId: NetworkHexId
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction
    simulation: SimulationResult
    gasEstimate: string
    rawTransaction: EthSendRawTransaction
    submitedTransaction: SubmitedTransaction
    selectedFee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
    selectedGas: string
    selectedNonce: number
}

export type SubmitedQueued = Omit<Submited, 'submitedTransaction'> & {
    submitedTransaction: SubmitedTransactionQueued
}

export type CancelSimulated = {
    state: 'cancel_simulated'
    networkHexId: NetworkHexId
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction
    simulation: SimulationResult
    gasEstimate: string
    rawTransaction: EthSendRawTransaction
    submitedTransaction: SubmitedTransactionQueued
    selectedGas: string
    selectedFee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
    selectedNonce: number

    cancelRPCRequest: EthSendTransaction
    cancelFee: EstimatedFee
}

export type CancelSubmited = {
    state: 'cancel_submited'
    networkHexId: NetworkHexId
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction
    simulation: SimulationResult
    gasEstimate: string
    rawTransaction: EthSendRawTransaction
    submitedTransaction: SubmitedTransactionQueued
    selectedGas: string
    selectedFee: EstimatedFee | components['schemas']['CustomPresetRequestFee']
    selectedNonce: number

    cancelRPCRequest: EthSendTransaction
    cancelFee: EstimatedFee
    cancelRawTransaction: EthSendRawTransaction
    cancelSubmitedTransaction: SubmitedTransaction
}

export type TransactionRequest =
    | NotSigned
    | Simulated
    | Submited
    | CancelSimulated
    | CancelSubmited
