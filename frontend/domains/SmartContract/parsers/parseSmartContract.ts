import {
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

import { SmartContract } from '../SmartContract'

export const parseSmartContract = (
    input: unknown
): Result<unknown, SmartContract> =>
    object(input).andThen((obj) =>
        shape({
            address: string(obj.address),
            networkHexId: oneOf(obj, [
                parseNetworkHexId(obj.network),
                parseNetworkHexId(obj.networkHexId),
            ]),
            name: nullableOf(obj.name, string),
            logo: nullableOf(obj.logo, string),
            website: nullableOf(obj.website, string),
        })
    )
