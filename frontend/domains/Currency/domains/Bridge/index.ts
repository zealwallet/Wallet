import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'
import { NetworkMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

export type BridgePollable = PollableData<BridgeRequest[], BridgeRouteRequest>
export type BridgeSubmittedPollable = PollableData<
    BridgeSubmittedStatus,
    { request: BridgeSubmitted }
>

export type BridgeRouteRequest = {
    fromAccount: Account
    fromAmount: string | null
    fromCurrency: CryptoCurrency
    toCurrency: CryptoCurrency
    slippagePercent: number // float 0..100
    refuel: boolean
    bridgeRouteName: string | null
    networkMap: NetworkMap

    knownCurrencies: KnownCurrencies
}

export type BridgeRequest = {
    type: 'bridge_request'

    route: BridgeRoute

    knownCurrencies: KnownCurrencies
}
export type SubmitedBridgesMap = Record<Address, BridgeSubmitted[]>

export type BridgeSubmitted = {
    type: 'bridge_submitted'

    route: BridgeRoute
    knownCurrencies: KnownCurrencies

    fromAddress: Address
    submittedAtMS: number
    sourceTransactionHash: string
}

export type RequestState = {
    type: 'pending' | 'completed' | 'not_started'
}

export type BridgeSubmittedStatus = {
    refuel: RequestState | null
    targetTransaction: RequestState
}

export type BridgeRoute = {
    displayName: string
    icon: string

    name: string // work like id for bridge
    approvalTransaction: EthSendTransaction | null
    sourceTransaction: EthSendTransaction

    serviceTimeMs: number

    feeInDefaultCurrency: Money

    from: Money
    fromPriceInDefaultCurrency: Money

    to: Money
    toPriceInDefaultCurrency: Money

    refuel: Refuel | null
}

export type Refuel = {
    from: Money
    to: Money
}
