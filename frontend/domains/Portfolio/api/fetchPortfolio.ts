import { get } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { excludeNullValues } from '@zeal/toolkit/Array/helpers/excludeNullValues'
import { values } from '@zeal/toolkit/Object'

import { Address } from '@zeal/domains/Address'
import { fetchBalanceOf } from '@zeal/domains/Address/api/fetchBalanceOf'
import { fetchNativeBalance } from '@zeal/domains/Address/api/fetchNativeBalance'
import { CryptoCurrency } from '@zeal/domains/Currency'
import {
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Portfolio } from '@zeal/domains/Portfolio'
import { parse as parsePortfolio } from '@zeal/domains/Portfolio/helpers/parse'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'

export type Request = {
    address: Address
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
    forceRefresh: boolean
}

const fetchNetworksNativeBalances = async ({
    address,
    networks,
    networkRPCMap,
    signal,
}: {
    networks: (CustomNetwork | TestNetwork)[]
    address: Address
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}): Promise<Token[]> => {
    const nativeTokens = await Promise.all(
        networks.map(
            (testNetwork): Promise<Token | null> =>
                fetchNativeBalance({
                    address,
                    network: testNetwork,
                    networkRPCMap,
                    signal,
                })
                    .then((balance): Token | null =>
                        balance === 0n
                            ? null
                            : {
                                  balance: {
                                      amount: balance,
                                      currencyId: testNetwork.nativeCurrency.id,
                                  },
                                  address: getNativeTokenAddress(testNetwork),
                                  networkHexId: testNetwork.hexChainId,
                                  priceInDefaultCurrency: null,
                                  rate: null,
                                  marketData: null,
                                  scam: false,
                              }
                    )
                    .catch(() => null)
        )
    )

    return nativeTokens.filter(excludeNullValues)
}

const fetchTestNetworksTokensBalances = async ({
    address,
    customCurrencies,
    networkMap,
    networkRPCMap,
    signal,
}: {
    address: Address
    networkMap: NetworkMap
    customCurrencies: CustomCurrencyMap
    networkRPCMap: NetworkRPCMap
    signal?: AbortSignal
}): Promise<Token[]> => {
    const customCurrenciesArray = await Promise.all(
        values(customCurrencies).map(
            (cryptoCurrency): Promise<Token | null> => {
                const network = findNetworkByHexChainId(
                    cryptoCurrency.networkHexChainId,
                    networkMap
                )
                return fetchBalanceOf({
                    account: address,
                    contract: cryptoCurrency.address,
                    network,
                    networkRPCMap,
                    signal,
                })
                    .then(
                        (balance): Token => ({
                            balance: {
                                amount: balance,
                                currencyId: cryptoCurrency.id,
                            },
                            address: cryptoCurrency.address,
                            networkHexId: network.hexChainId,
                            priceInDefaultCurrency: null,
                            rate: null,
                            marketData: null,
                            scam: false,
                        })
                    )
                    .catch(() => null)
            }
        )
    )

    return customCurrenciesArray.filter(excludeNullValues)
}

export const fetchServerPortfolio = async ({
    address,
    signal,
    forceRefresh,
}: {
    address: Address
    signal?: AbortSignal
    forceRefresh: boolean
}): Promise<Portfolio> =>
    get(
        `/wallet/portfolio/${address}/`,
        { query: { forceRefresh } },
        signal
    ).then((res) =>
        parsePortfolio(res).getSuccessResultOrThrow('cannot parse portfolio')
    )

export const fetchPortfolio = async ({
    address,
    customCurrencies,
    signal,
    forceRefresh,
    networkMap,
    networkRPCMap,
}: Request): Promise<Portfolio> => {
    const networksToFetchNativeCurrency = values(networkMap).filter(
        (net): net is CustomNetwork | TestNetwork => {
            switch (net.type) {
                case 'predefined':
                    return false
                case 'custom':
                case 'testnet':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(net)
            }
        }
    )

    const [
        serverPortfolio,
        testNetworksNativeBalances,
        testNetworksTokensBalances,
    ] = await Promise.all([
        fetchServerPortfolio({ address, signal, forceRefresh }),
        fetchNetworksNativeBalances({
            address,
            networks: networksToFetchNativeCurrency,
            networkRPCMap,
            signal,
        }),
        fetchTestNetworksTokensBalances({
            address,
            customCurrencies,
            networkMap,
            networkRPCMap,
            signal,
        }),
    ])

    const nativeCurrencies = networksToFetchNativeCurrency
        .map(({ nativeCurrency }) => nativeCurrency)
        .reduce(
            (acc, item) => ({ ...acc, [item.id]: item }),
            {} as Record<string, CryptoCurrency>
        )

    return {
        ...serverPortfolio,
        currencies: {
            ...serverPortfolio.currencies,
            ...nativeCurrencies,
            ...customCurrencies,
        },
        tokens: [
            ...serverPortfolio.tokens,
            ...testNetworksNativeBalances,
            ...testNetworksTokensBalances,
        ],
    }
}
