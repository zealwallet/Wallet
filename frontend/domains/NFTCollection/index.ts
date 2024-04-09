import { components } from '@zeal/api/portfolio'

import { Address } from '@zeal/domains/Address'
import { Money } from '@zeal/domains/Money'
import { NetworkHexId } from '@zeal/domains/Network'

export type PortfolioNFTCollection = {
    name: string
    priceInDefaultCurrency: Money
    mintAddress: Address
    networkHexId: NetworkHexId
    nfts: PortfolioNFT[]
    standard: NFTStandard
}

export type PortfolioNFT = {
    uri: string | null
    name: string
    tokenId: string
    priceInDefaultCurrency: Money
    standard: NFTStandard
}

export type NFTStandard = 'Erc721' | 'Erc1155'

export type Nft = Omit<components['schemas']['Nft'], 'collectionInfo'> & {
    collectionInfo: NftCollectionInfo
}

export type NftCollectionInfo = Omit<
    components['schemas']['TransactionNftCollectionInfo'],
    'network'
> & { networkHexId: NetworkHexId }
