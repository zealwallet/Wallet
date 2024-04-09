import { components } from '@zeal/api/portfolio'

export type TransactionSafetyCheck =
    components['schemas']['TransactionSafetyCheck']

export type TransactionSimulationCheck = Extract<
    TransactionSafetyCheck,
    { type: 'TransactionSimulationCheck' }
>

export type TokenVerificationCheck = Extract<
    TransactionSafetyCheck,
    { type: 'TokenVerificationCheck' }
>

export type SmartContractBlacklistCheck = Extract<
    TransactionSafetyCheck,
    { type: 'SmartContractBlacklistCheck' }
>

export type NftCollectionCheck = Extract<
    TransactionSafetyCheck,
    { type: 'NftCollectionCheck' }
>

export type P2pReceiverTypeCheck = Extract<
    TransactionSafetyCheck,
    { type: 'P2pReceiverTypeCheck' }
>

export type ApprovalSpenderTypeCheck = Extract<
    TransactionSafetyCheck,
    { type: 'ApprovalSpenderTypeCheck' }
>

export type FailedTransactionSafetyCheck = Extract<
    TransactionSafetyCheck,
    { state: 'Failed' }
>
