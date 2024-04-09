import { Address } from '@zeal/domains/Address'
import { App } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'
import { Token } from '@zeal/domains/Token'

export type Portfolio = {
    currencies: KnownCurrencies
    tokens: Token[]
    apps: App[]
    nftCollections: PortfolioNFTCollection[]
}

declare const PortfolioMapIndexSymbol: unique symbol

export type PortfolioMap = Record<
    Address & {
        __portfolioMapIndex: typeof PortfolioMapIndexSymbol
    },
    Portfolio
>
