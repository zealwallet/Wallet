import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Token } from '@zeal/domains/Token'

export const filterByHideMap =
    (currencyHiddenMap: CurrencyHiddenMap) => (token: Token) => {
        const userSetHiddenPropertyOnTokenManually =
            currencyHiddenMap[token.balance.currencyId] !== undefined

        const isHidden = userSetHiddenPropertyOnTokenManually
            ? currencyHiddenMap[token.balance.currencyId]
            : token.scam
        return !isHidden
    }
