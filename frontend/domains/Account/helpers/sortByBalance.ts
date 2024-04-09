import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

export const sortByBalance =
    (portfolioMap: PortfolioMap, currencyHiddenMap: CurrencyHiddenMap) =>
    (acc1: Account, acc2: Account): number => {
        const portfolio1 = getPortfolio({
            address: acc1.address,
            portfolioMap,
        })
        const portfolio2 = getPortfolio({
            address: acc2.address,
            portfolioMap,
        })
        const amount1 = portfolio1
            ? sumPortfolio(portfolio1, currencyHiddenMap).amount
            : 0n
        const amount2 = portfolio2
            ? sumPortfolio(portfolio2, currencyHiddenMap).amount
            : 0n

        if (amount1 < amount2) {
            return 1
        } else if (amount1 > amount2) {
            return -1
        } else {
            return 0
        }
    }
