import { Address } from '@zeal/domains/Address'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'

export const removePortfolio = ({
    address,
    portfolioMap,
}: {
    portfolioMap: PortfolioMap
    address: Address
}): PortfolioMap => {
    const { [address]: _, ...remainingKeyStoreMap } = portfolioMap as Record<
        Address,
        Portfolio
    >

    return remainingKeyStoreMap
}
