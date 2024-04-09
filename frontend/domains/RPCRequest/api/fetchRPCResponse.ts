import { post as customRPCPost } from '@zeal/api/customRPCClient'
import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { failure, object, Result, success } from '@zeal/toolkit/Result'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { RPCResponseError } from '@zeal/domains/Error/domains/RPCError'
import { parseRPCErrorPayload } from '@zeal/domains/Error/domains/RPCError/parsers/parseRPCError'
import { Network, NetworkHexId, NetworkRPCMap } from '@zeal/domains/Network'
import { getNetworkRPC } from '@zeal/domains/Network/helpers/getNetworkRPC'
import { RPCRequest } from '@zeal/domains/RPCRequest'

const parseRPCResponse = (
    input: unknown,
    networkHexId: NetworkHexId
): Result<unknown, unknown> =>
    object(input).andThen((obj) =>
        obj.error
            ? parseRPCErrorPayload(obj.error)
                  .map(
                      (errorPayload) =>
                          new RPCResponseError(errorPayload, networkHexId)
                  )
                  .andThen((errorPayload) => failure(errorPayload))
            : success(obj.result)
    )

export const proxyRPCResponse = ({
    request,
    networkRPCMap,
    network,
    dAppSiteInfo,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap

    network: Network
    dAppSiteInfo: DAppSiteInfo
}) => fetch({ request, networkRPCMap, network, dAppSiteInfo })

export const fetchRPCResponse = ({
    request,
    networkRPCMap,
    network,
    signal,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap
    network: Network
    signal?: AbortSignal
}): Promise<unknown> =>
    fetch({ request, networkRPCMap, network, dAppSiteInfo: null, signal })

const fetch = async ({
    request,
    networkRPCMap,
    network,
    dAppSiteInfo,
    signal,
}: {
    request: RPCRequest
    networkRPCMap: NetworkRPCMap
    network: Network
    dAppSiteInfo: DAppSiteInfo | null
    signal?: AbortSignal
}): Promise<unknown> => {
    const networkRPC = getNetworkRPC({ network, networkRPCMap })

    switch (networkRPC.current.type) {
        case 'default':
            switch (network.type) {
                case 'predefined':
                case 'testnet':
                    return post(
                        '/wallet/rpc/',
                        {
                            query: { network: network.name },
                            body: request,
                            requestSource: dAppSiteInfo?.hostname,
                        },
                        signal
                    ).then((res): unknown =>
                        parseRPCResponse(
                            res,
                            network.hexChainId
                        ).getSuccessResultOrThrow(
                            'failed to parse RPC response'
                        )
                    )
                case 'custom':
                    const res = await customRPCPost(
                        network.rpcUrl,
                        request,
                        signal
                    )
                    return parseRPCResponse(
                        res,
                        network.hexChainId
                    ).getSuccessResultOrThrow(
                        'custom network default RPC request failed'
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }

        case 'custom':
            const res = await customRPCPost(networkRPC.current.url, request)
            return parseRPCResponse(
                res,
                network.hexChainId
            ).getSuccessResultOrThrow(
                'failed to parse RPC response from custom rpc'
            )

        default:
            return notReachable(networkRPC.current)
    }
}
