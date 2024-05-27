import { ReactNode } from 'react'

import { Address } from '@zeal/domains/Address'
import { Money } from '@zeal/domains/Money'
import { NetworkHexId } from '@zeal/domains/Network'

export type App = {
    name: string
    icon: string
    networkHexId: NetworkHexId
    priceInDefaultCurrency: Money
    url: string | null
    protocols: AppProtocol[]
}

export type AppProtocol =
    | CommonProtocol
    | LockedToken
    | Lending
    | Vesting
    | UnknownProtocol

export type CommonProtocol = {
    type: 'CommonAppProtocol'
    priceInDefaultCurrency: Money
    suppliedTokens: AppToken[]
    borrowedTokens: AppToken[]
    rewardTokens: AppToken[]
    category: string
    description: string | null
}

export type LockedToken = {
    type: 'LockedTokenAppProtocol'
    priceInDefaultCurrency: Money
    lockedTokens: AppToken[]
    rewardTokens: AppToken[]
    unlockAt: number
    category: string
    description: string | null
}

export type Lending = {
    type: 'LendingAppProtocol'
    priceInDefaultCurrency: Money
    suppliedTokens: AppToken[]
    borrowedTokens: AppToken[]
    rewardTokens: AppToken[]
    category: string
    healthFactor: number
}

export type Vesting = {
    type: 'VestingAppProtocol'
    priceInDefaultCurrency: Money
    vestedToken: AppToken
    claimableToken: AppToken
    category: string
}

export type UnknownProtocol = {
    type: 'UnknownAppProtocol'
    priceInDefaultCurrency: Money
    tokens: AppToken[]
    nfts: AppNft[]
    category: string
}

export type AppToken = {
    networkHexId: NetworkHexId
    name: string
    address: Address
    balance: Money
    priceInDefaultCurrency: Money | null
}

export type AppNft = {
    tokenId: string
    name: string | null
    amount: string
    decimals: number
    priceInDefaultCurrency: Money | null
    uri: string | null
}

export type PlaceholderApp = {
    logo: (size: number) => ReactNode
    name: string
    description: ReactNode
    link: string
}
