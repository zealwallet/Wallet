import { Address } from '@zeal/domains/Address'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Params = {
    address: Address
    customCurrencies: CustomCurrencyMap
    startTimestampMs: number
    maxTimeMs: number
    remainingRetries: number
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}

export const fetchPortfolioWithRetries = async ({
    address,
    customCurrencies,
    startTimestampMs,
    remainingRetries,
    maxTimeMs,
    networkMap,
    networkRPCMap,
    signal,
}: Params): Promise<Portfolio> => {
    try {
        return await fetchPortfolio({
            address,
            customCurrencies,
            signal,
            networkMap,
            networkRPCMap,
            forceRefresh: false, // We should not do force refresh because we do retries
        })
    } catch (error) {
        if (
            remainingRetries <= 0 ||
            Date.now() - startTimestampMs > maxTimeMs
        ) {
            throw error
        }

        return fetchPortfolioWithRetries({
            address,
            customCurrencies,
            remainingRetries: remainingRetries - 1,
            maxTimeMs,
            startTimestampMs,
            networkMap,
            networkRPCMap,
            signal,
        })
    }
}
