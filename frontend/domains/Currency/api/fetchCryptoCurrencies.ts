import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'
import { object, recordStrict, string } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Network, PredefinedNetwork, TestNetwork } from '@zeal/domains/Network'

import { CryptoCurrency } from '..'
import { parseCryptoCurrency } from '../helpers/parse'

type CurrencyAddressesForNetwork = Omit<
    components['schemas']['CurrenciesNetworkAddresses'],
    'network'
> & { network: Network }

type CurrencyAddressesForPredefinedOrTestNetwork = Omit<
    components['schemas']['CurrenciesNetworkAddresses'],
    'network'
> & { network: PredefinedNetwork | TestNetwork }

type Params = {
    currencies: CurrencyAddressesForNetwork[]
}

const isPredefinedOrTestNetworkCurrencyAddresses = (
    item: CurrencyAddressesForNetwork
): item is CurrencyAddressesForPredefinedOrTestNetwork => {
    switch (item.network.type) {
        case 'predefined':
        case 'testnet':
            return true

        case 'custom':
            return false
        default:
            return notReachable(item.network)
    }
}

/**
 * TODO @resetko-zeal This fetcher maybe can be improved. First probably we need to accept only those networks which are supported by BE, so exclude custom networks.
 *                    Second is that parsing looks a bit suboptimal now, and probably won't work well for big currencies lists,
 *                    because we first parse knownCurrencies fully, and then selecting only those which we need, but probably we can do this other way around
 */
export const fetchCryptoCurrencies = async ({
    currencies,
}: Params): Promise<CryptoCurrency[]> => {
    const filteredCurrenciesGroupedByNetwork = currencies.filter(
        isPredefinedOrTestNetworkCurrencyAddresses
    )

    if (filteredCurrenciesGroupedByNetwork.length !== currencies.length) {
        throw new ImperativeError(
            `We can't fetch currencies for custom networks.`,
            { currencies }
        )
    }

    return post('/wallet/currencies', {
        body: filteredCurrenciesGroupedByNetwork.map((item) => ({
            network: item.network.name,
            addresses: item.addresses,
        })),
    }).then((response) =>
        object(response.currencies)
            .andThen((curriencies) =>
                recordStrict(curriencies, {
                    keyParser: string,
                    valueParser: (val) =>
                        object(val).andThen(parseCryptoCurrency),
                })
            )
            .map((knownCurrencies) => values(knownCurrencies))
            .getSuccessResultOrThrow(
                'Failed to parse crypto currencies response'
            )
    )
}
