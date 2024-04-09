import {
    arrayOf,
    number,
    object,
    oneOf,
    parseHttpsUrl,
    Result,
    safeArrayOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { NetworkHexId } from '@zeal/domains/Network'

export const parseNetworks = (
    input: unknown
): Result<unknown, ChainIdNetwork> =>
    object(input).andThen((requestData) =>
        shape({
            chainId: number(requestData.chainId).andThen((int) =>
                success(`0x${int.toString(16)}` as NetworkHexId)
            ),
            name: string(requestData.name),
            rpcUrls: arrayOf(requestData.rpc, string),
            nativeCurrency: object(requestData.nativeCurrency).andThen((o) =>
                shape({
                    symbol: string(o.symbol),
                    decimals: number(o.decimals),
                })
            ),
            blockExplorerUrls: oneOf(requestData, [
                safeArrayOf(requestData.blockExplorerUrls, (input: unknown) =>
                    object(input).andThen((input) =>
                        string(input.url).andThen(parseHttpsUrl)
                    )
                ),
                success([] as []),
            ]),
        })
    )
