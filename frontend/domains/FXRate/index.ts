// https://corporatefinanceinstitute.com/resources/knowledge/economics/currency-pair/

import { Currency, CurrencyId } from '@zeal/domains/Currency'

// FIXME @resetko-zeal kill
export type FXRate = {
    base: CurrencyId
    quote: CurrencyId
    rate: bigint
}

export type FXRate2<B extends Currency, Q extends Currency> = {
    base: B
    quote: Q
    rate: bigint
}
