import {
    nullableOf,
    number,
    object,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Nft } from '@zeal/domains/NFTCollection'
import { parseNftCollectionInfo } from '@zeal/domains/NFTCollection/parsers/parseNftCollectionInfo'

export const parseNft = (input: unknown): Result<unknown, Nft> =>
    object(input).andThen((obj) =>
        shape({
            tokenId: string(obj.tokenId),
            name: nullableOf(obj.name, string),
            image: nullableOf(obj.image, string),
            collectionInfo: parseNftCollectionInfo(obj.collectionInfo),
            decimals: number(obj.decimals),
        })
    )
