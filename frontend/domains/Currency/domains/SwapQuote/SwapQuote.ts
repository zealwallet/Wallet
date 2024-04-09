import { Account } from '@zeal/domains/Account'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Money } from '@zeal/domains/Money'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'

export type SwapQuoteRequest = {
    fromAccount: Account
    portfolio: Portfolio
    networkMap: NetworkMap

    fromCurrency: CryptoCurrency
    toCurrency: CryptoCurrency | null

    amount: string | null

    swapSlippagePercent: number

    usedDexName: string | null
    knownCurrencies: KnownCurrencies
}

export type SwapQuote = {
    routes: SwapRoute[]
    bestReturnRoute: SwapRoute | null

    knownCurrencies: KnownCurrencies
}

export type SwapRoute = {
    dexName: string
    protocolDisplayName: string
    protocolIcon: string
    priceInDefaultCurrency: Money | null
    toAmount: bigint
    toCurrencyId: CurrencyId

    network: Network

    estimatedGasFeeInDefaultCurrency: Money | null

    approvalTransaction: EthSendTransaction | null
    swapTransaction: EthSendTransaction
}
