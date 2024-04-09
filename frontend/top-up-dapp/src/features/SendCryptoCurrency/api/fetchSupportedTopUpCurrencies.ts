import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'
import { object } from '@zeal/toolkit/Result'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export const POLYGON_MATIC: CryptoCurrency = {
    type: 'CryptoCurrency',
    id: 'Polygon|0x0000000000000000000000000000000000001010',
    symbol: 'MATIC',
    code: 'MATIC',
    fraction: 18,
    rateFraction: 18,
    icon: 'https://rdwdvjp8j5.execute-api.eu-west-1.amazonaws.com/wallet/image/currency/Polygon|0x0000000000000000000000000000000000001010',
    name: 'MATIC',
    address: '0x0000000000000000000000000000000000001010',
    networkHexChainId: parseNetworkHexId('0x89').getSuccessResultOrThrow(
        'failed to parse static network hex id'
    ),
}

const ETHEREUM_ETH: CryptoCurrency = {
    type: 'CryptoCurrency',
    id: 'Ethereum|0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    code: 'ETH',
    fraction: 18,
    rateFraction: 18,
    icon: 'https://rdwdvjp8j5.execute-api.eu-west-1.amazonaws.com/wallet/image/currency/Ethereum|0x0000000000000000000000000000000000000000',
    name: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    networkHexChainId: parseNetworkHexId('0x1').getSuccessResultOrThrow(
        'failed to parse static network hex id'
    ),
}

const TOP_UP_CURRENCIES: CryptoCurrency[] = [POLYGON_MATIC, ETHEREUM_ETH]

const createRequest = (): components['schemas']['CurrenciesRequest'] =>
    PREDEFINED_NETWORKS.map((network) => ({
        network: network.name,
        addresses: [network.gasTokenAddress],
    }))

export const fetchSupportedTopUpCurrencies = (): Promise<CryptoCurrency[]> =>
    post('/wallet/currencies', { body: createRequest() })
        .then((response) =>
            object(response)
                .andThen((obj) => parseKnownCurrencies(obj.currencies))
                .map((knownCurrencies) =>
                    values(knownCurrencies).filter(
                        (currency): currency is CryptoCurrency => {
                            switch (currency.type) {
                                case 'CryptoCurrency':
                                    return true
                                case 'FiatCurrency':
                                    return false
                                /* istanbul ignore next */
                                default:
                                    return notReachable(currency)
                            }
                        }
                    )
                )
                .getSuccessResultOrThrow(
                    'Failed to parse supported crypto currencies'
                )
        )
        .catch((e) => {
            captureError(e)
            return TOP_UP_CURRENCIES
        })
