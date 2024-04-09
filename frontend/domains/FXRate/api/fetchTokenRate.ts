import { notReachable } from '@zeal/toolkit'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { fetchRate } from '@zeal/domains/FXRate/api/fetchRate'
import { NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Token } from '@zeal/domains/Token'

export const fetchTokenRate = async (
    token: Token,
    knownCurrencies: KnownCurrencies,
    networkMap: NetworkMap
): Promise<FXRate | null> => {
    const currency = knownCurrencies[token.balance.currencyId]
    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('trying to get rate for fiat currency')
        case 'CryptoCurrency': {
            const net = findNetworkByHexChainId(token.networkHexId, networkMap)

            switch (net.type) {
                case 'predefined':
                    const { rate } = await fetchRate({
                        tokenAddress: currency.address,
                        network: net,
                    })
                    return rate
                case 'custom':
                case 'testnet':
                    return null
                /* istanbul ignore next */
                default:
                    return notReachable(net)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
