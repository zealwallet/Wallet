import { excludeNullValues } from '@zeal/toolkit/Array/helpers/excludeNullValues'

import { App } from '@zeal/domains/App'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DEFAULT_CURRENCY_ID } from '@zeal/domains/Currency/constants'
import { Money } from '@zeal/domains/Money'
import { sum } from '@zeal/domains/Money/helpers/sum'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

const zeroInDefaultCurrency: Money = {
    amount: 0n,
    currencyId: DEFAULT_CURRENCY_ID,
}

export const sumTokensInDefaultCurrency = (tokens: Token[]): Money | null =>
    sum(
        tokens
            .map(
                ({ priceInDefaultCurrency: balanceInDefaultCurrency }) =>
                    balanceInDefaultCurrency
            )
            .filter(excludeNullValues)
    )

export const sumAppsInDefaultCurrency = (apps: App[]): Money | null =>
    sum(
        apps.map(
            ({ priceInDefaultCurrency: balanceInDefaultCurrency }) =>
                balanceInDefaultCurrency
        )
    )

export const sumNFTSInDefaultCurrency = (
    ntfs: PortfolioNFTCollection[]
): Money | null =>
    sum(ntfs.map(({ priceInDefaultCurrency }) => priceInDefaultCurrency))

export const sumPortfolio = (
    portfolio: Portfolio,
    currencyHiddenMap: CurrencyHiddenMap
): Money => {
    const tokensSum = sumTokensInDefaultCurrency(
        portfolio.tokens.filter(filterByHideMap(currencyHiddenMap))
    )
    const appsSum = sumAppsInDefaultCurrency(portfolio.apps)
    const ntfsSum = sumNFTSInDefaultCurrency(portfolio.nftCollections)

    return (
        sum([tokensSum, appsSum, ntfsSum].filter(excludeNullValues)) ||
        zeroInDefaultCurrency
    )
}
