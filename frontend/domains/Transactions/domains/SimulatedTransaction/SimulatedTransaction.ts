import { components } from '@zeal/api/portfolio'

import { Address } from '@zeal/domains/Address'
import { WithdrawalRequest } from '@zeal/domains/Currency/domains/BankTransfer'
import { BridgeRoute } from '@zeal/domains/Currency/domains/Bridge'
import { Money } from '@zeal/domains/Money'
import { Nft, NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { SmartContract } from '@zeal/domains/SmartContract'
import { ApprovalAmount, TransactionNft } from '@zeal/domains/Transactions'

export type SimulatedTransaction =
    | ApprovalTransaction
    | UnknownTransaction
    | FailedTransaction
    | SingleNftApprovalTransaction
    | NftCollectionApprovalTransaction
    | P2PTransaction
    | P2PNFTTransaction
    | BridgeTrx
    | WithdrawalTrx

export type SimulatedGasEstimate =
    | {
          type: 'GasEstimate'
          gas: string
      }
    | {
          type: 'OptimisticRollupGasEstimate'
          l1Gas: string
          l2Gas: string
      }

export type WithdrawalTrx = {
    type: 'WithdrawalTrx'
    withdrawalRequest: WithdrawalRequest
}

export type BridgeTrx = {
    type: 'BridgeTrx'
    bridgeRoute: BridgeRoute
}

// TODO ideally part of Openapi, now is mapped?
export type ApprovalTransaction = {
    type: 'ApprovalTransaction'
    amount: ApprovalAmount
    approveTo: SmartContract
    simulatedGas: SimulatedGasEstimate
}

// TODO ideally part of Openapi, now is mapped?
export type UnknownTransaction = {
    type: 'UnknownTransaction'
    method: string
    tokens: UnknownTransactionToken[]
    nfts: TransactionNft[]
    simulatedGas: SimulatedGasEstimate
}

export type FailedTransaction = components['schemas']['FailedTransaction']

export type P2PTransaction = {
    type: 'P2PTransaction'
    token: UnknownTransactionToken
    toAddress: Address
    simulatedGas: SimulatedGasEstimate
}

export type P2PNFTTransaction = {
    type: 'P2PNftTransaction'
    nft: TransactionNft
    toAddress: Address
    simulatedGas: SimulatedGasEstimate
}

export type SingleNftApprovalTransaction = Omit<
    components['schemas']['SingleNftApprovalTransaction'],
    'gas' | 'approveTo' | 'nft'
> & {
    approveTo: SmartContract
    nft: Nft
}

export type NftCollectionApprovalTransaction = Omit<
    components['schemas']['NftCollectionApprovalTransaction'],
    'gas' | 'nftCollectionInfo' | 'approveTo'
> & {
    nftCollectionInfo: NftCollectionInfo
    approveTo: SmartContract
}

/**
 * It might look same as TransactionToken, but it renders little different
 * and also have priceInDefaultCurrency not optional
 */
export type UnknownTransactionToken = {
    direction: 'Send' | 'Receive'
    amount: Money
    priceInDefaultCurrency: Money | null
}
