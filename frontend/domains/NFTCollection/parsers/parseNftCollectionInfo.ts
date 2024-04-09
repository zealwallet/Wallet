import {
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { fromString as parseAddressFromString } from '@zeal/domains/Address/helpers/fromString'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { NftCollectionInfo } from '@zeal/domains/NFTCollection'

export const parseNftCollectionInfo = (
    input: unknown
): Result<unknown, NftCollectionInfo> =>
    object(input).andThen((obj) =>
        shape({
            name: nullableOf(obj.name, string),
            address: string(obj.address).andThen(parseAddressFromString),
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
        })
    )
