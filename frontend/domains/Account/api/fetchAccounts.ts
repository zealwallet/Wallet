import { Address } from '@zeal/domains/Address'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

export type FetchPortfolioRequest = {
    address: Address
    customCurrencies: CustomCurrencyMap
    signal?: AbortSignal
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    forceRefresh: boolean
}

export type FetchPortfolioResponse = {
    fetchedAt: Date
    portfolio: Portfolio
}

export const fetchAccounts = ({
    signal,
    customCurrencies,
    address,
    forceRefresh,
    networkMap,
    networkRPCMap,
}: FetchPortfolioRequest): Promise<FetchPortfolioResponse> =>
    fetchPortfolio({
        address,
        customCurrencies,
        signal,
        networkMap,
        networkRPCMap,
        forceRefresh,
    }).then((portfolio) => ({
        fetchedAt: new Date(),
        portfolio,
    }))
