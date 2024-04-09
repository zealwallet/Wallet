import {
    array,
    combine,
    match,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parse as parseMoney } from '@zeal/domains/Money/helpers/parse'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    NFTStandard,
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'

export const parse = (
    input: unknown
): Result<unknown, PortfolioNFTCollection> =>
    object(input).andThen((obj) =>
        shape({
            name: string(obj.name),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            mintAddress: parseAddress(obj.mintAddress),
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            nfts: array(obj.nfts).andThen((arr) => combine(arr.map(parseNFT))),
            standard: parseStandard(obj.standard),
        })
    )

const parseStandard = (input: unknown): Result<unknown, NFTStandard> =>
    oneOf(input, [
        match(input, 'Erc721' as const),
        match(input, 'Erc1155' as const),
    ])

const parseNFT = (input: unknown): Result<unknown, PortfolioNFT> =>
    object(input).andThen((obj) =>
        shape({
            uri: nullableOf(obj.uri, string),
            name: string(obj.name),
            tokenId: string(obj.tokenId),
            priceInDefaultCurrency: parseMoney(obj.priceInDefaultCurrency),
            standard: parseStandard(obj.standard),
        })
    )
