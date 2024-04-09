import { components } from '@zeal/api/portfolio'

import { Address } from '@zeal/domains/Address'
import { CryptoMoney, FiatMoney } from '@zeal/domains/Money'
import { NetworkHexId } from '@zeal/domains/Network'
import { Nft, NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { SmartContract } from '@zeal/domains/SmartContract'

export type RpcTransaction = {
    blockNumber: bigint
    nonce: bigint
}

export type TransactionActivity = {
    continueFromTimestamp: number | null
    transactions: ActivityTransaction[]
}

export type ActivityTransaction =
    | InboundP2PActivityTransaction
    | OutboundP2PActivityTransaction
    | OutboundP2PNftActivityTransaction
    | SelfP2PActivityTransaction
    | SingleNftApprovalActivityTransaction
    | SingleNftApprovalRevokeActivityTransaction
    | NftCollectionApprovalActivityTransaction
    | NftCollectionApprovalRevokeActivityTransaction
    | Erc20ApprovalActivityTransaction
    | Erc20ApprovalRevokeActivityTransaction
    | PartialTokenApprovalActivityTransaction
    | UnknownActivityTransaction
    | FailedActivityTransaction

export type InboundP2PActivityTransaction = {
    type: 'InboundP2PActivityTransaction'
    tokens: TransactionToken[]
    nfts: TransactionNft[]
    sender: Address
} & Omit<Common, 'paidFee'>

export type OutboundP2PActivityTransaction = {
    type: 'OutboundP2PActivityTransaction'
    token: TransactionToken
    receiver: Address
} & Common

export type OutboundP2PNftActivityTransaction = {
    type: 'OutboundP2PNftActivityTransaction'
    nft: TransactionNft
    receiver: Address
} & Common

export type SelfP2PActivityTransaction = {
    type: 'SelfP2PActivityTransaction'
} & Common

export type SingleNftApprovalActivityTransaction = {
    type: 'SingleNftApprovalActivityTransaction'
    nft: Nft
    approveTo: SmartContract
} & Common

export type SingleNftApprovalRevokeActivityTransaction = {
    type: 'SingleNftApprovalRevokeActivityTransaction'
    nft: Nft
    revokeFrom: SmartContract
} & Common

export type NftCollectionApprovalActivityTransaction = {
    type: 'NftCollectionApprovalActivityTransaction'
    nftCollectionInfo: NftCollectionInfo
    approveTo: SmartContract
} & Common

export type NftCollectionApprovalRevokeActivityTransaction = {
    type: 'NftCollectionApprovalRevokeActivityTransaction'
    nftCollectionInfo: NftCollectionInfo
    revokeFrom: SmartContract
} & Common

export type Erc20ApprovalActivityTransaction = {
    type: 'Erc20ApprovalActivityTransaction'
    approveTo: SmartContract
    allowance: ApprovalAmount
} & Common

export type Erc20ApprovalRevokeActivityTransaction = {
    type: 'Erc20ApprovalRevokeActivityTransaction'
    revokeFrom: SmartContract
    allowance: ApprovalAmount
} & Common

export type PartialTokenApprovalActivityTransaction = {
    type: 'PartialTokenApprovalActivityTransaction'
    approveTo: SmartContract
} & Common

export type UnknownActivityTransaction = {
    type: 'UnknownActivityTransaction'
    method: string
    smartContract: SmartContract
    tokens: TransactionToken[]
    nfts: TransactionNft[]
} & Common

export type FailedActivityTransaction = {
    type: 'FailedActivityTransaction'
    method: string
    smartContract: SmartContract
} & Common

export type Common = {
    networkHexId: NetworkHexId
    hash: Address
    timestamp: Date
    paidFee: PaidFee | null
}

export type PaidFee = {
    priceInNativeCurrency: CryptoMoney
    priceInDefaultCurrency: FiatMoney | null
}

export type TransactionToken = {
    type: 'transaction_token'
    direction: 'Send' | 'Receive'
    amount: CryptoMoney | FiatMoney
    priceInDefaultCurrency: FiatMoney | null
}

export type TransactionNft = {
    type: 'transaction_nft'
    nft: Nft
    amount: bigint
    direction: components['schemas']['TransactionDirection']
}

export type ApprovalAmount =
    | {
          type: 'Limited'
          amount: CryptoMoney
      }
    | {
          type: 'Unlimited'
          amount: CryptoMoney
      }
