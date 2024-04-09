import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { combine, nullableOf, Result, shape } from '@zeal/toolkit/Result'

import { CurrencyId, KnownCurrencies } from '@zeal/domains/Currency'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { ImperativeError } from '@zeal/domains/Error'
import { Money } from '@zeal/domains/Money'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { Network } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { SimulatedGasEstimate } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

export type SafeTransactionFee = {
    feeInDefaultCurrency: Money | null
    feeInTokenCurrency: Money
}

export type SafeTransactionFeeForecast = {
    currencies: KnownCurrencies
    feeOptions: SafeTransactionFee[]
}

const parseSafeTransactionFeeForecast = (
    input: components['schemas']['GasAbstractionFeeForecast']
): Result<unknown, SafeTransactionFeeForecast> =>
    shape({
        currencies: parseKnownCurrencies(input.currencies),
        feeOptions: combine(
            input.feeOptions.map((feeOption) =>
                shape({
                    feeInDefaultCurrency: nullableOf(
                        feeOption.feeInDefaultCurrency,
                        parseMoney
                    ),
                    feeInTokenCurrency: parseMoney(
                        feeOption.feeInTokenCurrency
                    ),
                })
            )
        ),
    })

export const fetchSafeTransactionFeeForecast = async ({
    gasEstimate,
    network,
    portfolio,
}: {
    gasEstimate: SimulatedGasEstimate
    network: Network
    portfolio: Portfolio | null
}): Promise<SafeTransactionFeeForecast> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet': {
            const response = await post(
                '/wallet/fee/gas-abstraction-forecast/',
                {
                    body: gasEstimate,
                    query: { network: network.name },
                }
            )

            const feeForecast = parseSafeTransactionFeeForecast(
                response
            ).getSuccessResultOrThrow(
                'Failed to parse safe transaction fee forecast'
            )

            const feeOptionsCurrencyIds = new Set<CurrencyId>(
                feeForecast.feeOptions.map(
                    (fee) => fee.feeInTokenCurrency.currencyId
                )
            )

            const portfolioTokens = portfolio?.tokens || []
            const portfolioTokensMap = portfolioTokens
                .filter((token) =>
                    feeOptionsCurrencyIds.has(token.balance.currencyId)
                )
                .reduce((map, item) => {
                    map.set(item.balance.currencyId, item)
                    return map
                }, new Map<CurrencyId, Token>())

            const sortedFeeOptions = feeForecast.feeOptions.toSorted((a, b) => {
                const aTokenBalance =
                    portfolioTokensMap.get(a.feeInTokenCurrency.currencyId)
                        ?.priceInDefaultCurrency || null

                const bTokenBalance =
                    portfolioTokensMap.get(b.feeInTokenCurrency.currencyId)
                        ?.priceInDefaultCurrency || null

                const aTokenAmount = aTokenBalance?.amount || 0n
                const bTokenAmount = bTokenBalance?.amount || 0n

                if (aTokenAmount < bTokenAmount) {
                    return 1
                } else if (aTokenAmount > bTokenAmount) {
                    return -1
                } else {
                    return 0
                }
            })

            return {
                ...feeForecast,
                feeOptions: sortedFeeOptions,
            }
        }

        case 'custom':
            throw new ImperativeError(
                'Gas abstraction estimate is not supported for custom networks'
            )

        default:
            return notReachable(network)
    }
}
