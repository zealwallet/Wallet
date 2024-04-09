import { array, combine, object, Result, shape } from '@zeal/toolkit/Result'

import { parse as parseApp } from '@zeal/domains/App/helpers/parse'
import { parseKnownCurrencies } from '@zeal/domains/Currency/helpers/parse'
import { parse as parseNFTCollection } from '@zeal/domains/NFTCollection/parsers/parse'
import { Portfolio } from '@zeal/domains/Portfolio'
import { parse as parseToken } from '@zeal/domains/Token/helpers/parse'

export const parse = (input: unknown): Result<unknown, Portfolio> =>
    object(input).andThen((obj) =>
        shape({
            currencies: parseKnownCurrencies(obj.currencies),
            tokens: array(obj.tokens).andThen((arr) =>
                combine(arr.map(parseToken))
            ),
            apps: array(obj.apps).andThen((arr) => combine(arr.map(parseApp))),
            nftCollections: array(obj.nftCollections).andThen((arr) =>
                combine(arr.map(parseNFTCollection))
            ),
        })
    )
