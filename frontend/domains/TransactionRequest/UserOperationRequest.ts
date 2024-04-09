import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { Network } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SubmittedUserOperation } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import {
    MetaTransactionData,
    UserOperationWithSignature,
} from '@zeal/domains/UserOperation'

export type SimulatedWithDeploymentBundleUserOperationRequest = {
    type: 'simulated_safe_deployment_bundle_user_operation_request'
    network: Network
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction

    metaTransactionData: MetaTransactionData
    addOwnerMetaTransactionData: MetaTransactionData
    initCode: string
    entrypoint: Address

    simulationResult: SimulationResult
}

export type SimulatedWithoutDeploymentBundleUserOperationRequest = {
    type: 'simulated_safe_without_deployment_bundle_user_operation_request'
    network: Network
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction

    metaTransactionData: MetaTransactionData
    initCode: null
    entrypoint: Address

    simulationResult: SimulationResult
}

export type SimulatedWithAddOwnerUserOperationRequest = {
    type: 'simulated_safe_with_add_owner_user_operation_request'
    network: Network
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction

    metaTransactionData: MetaTransactionData
    addOwnerMetaTransactionData: MetaTransactionData
    initCode: null
    entrypoint: Address

    simulationResult: SimulationResult
}

export type SignedUserOperationRequest = {
    type: 'signed_safe_user_operation_request'
    network: Network
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction

    userOperationWithSignature: UserOperationWithSignature

    simulationResult: SimulationResult
}

export type SubmittedToBundlerUserOperationRequest = {
    type: 'submitted_safe_user_operation_request'
    network: Network
    account: Account
    dApp: DAppSiteInfo | null
    rpcRequest: EthSendTransaction

    submittedUserOperation: SubmittedUserOperation
    simulationResult: SimulationResult
}

export type SimulatedUserOperationRequest =
    | SimulatedWithDeploymentBundleUserOperationRequest
    | SimulatedWithoutDeploymentBundleUserOperationRequest
    | SimulatedWithAddOwnerUserOperationRequest
