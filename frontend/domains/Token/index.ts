import { Address } from '@zeal/domains/Address'
import { FXRate } from '@zeal/domains/FXRate'
import { Money } from '@zeal/domains/Money'
import { NetworkHexId } from '@zeal/domains/Network'

type PriceChange24H =
    | { direction: 'Unchanged' }
    | { direction: 'Up'; percentage: number }
    | { direction: 'Down'; percentage: number }

export type Token = {
    networkHexId: NetworkHexId
    balance: Money
    //TODO remove address and network should be got from KnownCurrencies when needed
    address: Address
    rate: FXRate | null
    priceInDefaultCurrency: Money | null
    marketData: null | { priceChange24h: PriceChange24H }
    scam: boolean
}
