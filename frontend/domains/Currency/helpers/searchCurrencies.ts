import { notReachable } from '@zeal/toolkit'

import {
    Currency,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { sortCurrencyByPinStatus } from '@zeal/domains/Currency/helpers/sortCurrencyByPinStatus'
import { ImperativeError } from '@zeal/domains/Error'
import { Portfolio } from '@zeal/domains/Portfolio'

type CurrenciesSearchResults =
    | {
          type: 'grouped_results'
          portfolioCurrencies: Currency[]
          nonPortfolioCurrencies: Currency[]
      }
    | { type: 'no_currencies_found' }

const MINIMUM_SEARCH_TERM_TO_SEARCH_BY_ADDRESS = 3

/**
 * @param knownCurrencies should by supplied as separate parameter, because currencies could contain non portfolio IDs
 */
export const searchCurrencies = ({
    currencies,
    knownCurrencies,
    portfolio,
    search,
    currencyPinMap,
}: {
    search: string
    currencies: CurrencyId[]
    portfolio: Portfolio
    knownCurrencies: KnownCurrencies
    currencyPinMap: CurrencyPinMap
}): CurrenciesSearchResults => {
    const mergedKnownCurrencies = {
        ...portfolio.currencies,
        ...knownCurrencies,
    }

    const currenciesIdsSet = new Set<CurrencyId>(currencies)

    const portfolioCurrencyIds = new Set<CurrencyId>(
        portfolio.tokens
            .map((token) => token.balance.currencyId)
            .filter((id) => currenciesIdsSet.has(id))
    )

    const searchToCheck = search.toLocaleLowerCase().trim()

    const nonPortfolioCurrencies = currencies
        .filter((currencyId) => !portfolioCurrencyIds.has(currencyId))
        .map((currencyId): Currency => {
            const currency = mergedKnownCurrencies[currencyId]
            if (!currency) {
                throw new ImperativeError(
                    'NonPortfolio currency not found in dictionary'
                )
            }
            return currency
        })
        .filter((currency) => checkMatch(currency, searchToCheck))

    const portfolioCurrencies = Array.from(portfolioCurrencyIds)
        .map((currencyId): Currency => {
            const currency = mergedKnownCurrencies[currencyId]
            if (!currency) {
                throw new ImperativeError(
                    'Portfolio currency not found in dictionary'
                )
            }
            return currency
        })
        .filter((currency) => checkMatch(currency, searchToCheck))
        .sort(sortCurrencyByPinStatus(currencyPinMap))

    return nonPortfolioCurrencies.length === 0 &&
        portfolioCurrencies.length === 0
        ? { type: 'no_currencies_found' }
        : {
              type: 'grouped_results',
              nonPortfolioCurrencies,
              portfolioCurrencies,
          }
}

const checkMatch = (currency: Currency, searchTerm: string): boolean => {
    switch (currency.type) {
        case 'FiatCurrency': {
            return (
                currency.symbol.toLowerCase().includes(searchTerm) ||
                currency.name.toLowerCase().includes(searchTerm)
            )
        }

        case 'CryptoCurrency': {
            const thingsToSearchIn =
                searchTerm.length >= MINIMUM_SEARCH_TERM_TO_SEARCH_BY_ADDRESS
                    ? [currency.address, currency.symbol, currency.name]
                    : [currency.symbol, currency.name]

            return thingsToSearchIn.reduce(
                (result, item) =>
                    result || item.toLowerCase().includes(searchTerm),
                false
            )
        }

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
