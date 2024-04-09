import { Address } from '@zeal/domains/Address'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'

export const getPortfolio = ({
    address,
    portfolioMap,
}: {
    portfolioMap: PortfolioMap
    address: Address
}): Portfolio | null =>
    (portfolioMap as Record<Address, Portfolio>)[address] || null
