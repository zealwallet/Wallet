import { ProposalTypes } from '@walletconnect/types'

import {
    array,
    combine,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { NetworkHexId } from '@zeal/domains/Network'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

import { WalletConnectConnectionRequest } from '..'

const parseChainsIds = (
    namespacesEip155: unknown
): Result<unknown, NetworkHexId[]> => {
    return oneOf(namespacesEip155, [
        object(namespacesEip155)
            .andThen((obj) => array(obj.chains))
            .andThen((chains) => combine(chains.map(string)))
            .map((chains) =>
                chains.map((chain) => chain.replace('eip155:', ''))
            )
            .andThen((chains) => combine(chains.map(parseNetworkHexId))),
        success([]),
    ])
}

export const parseWalletConnectConnectionRequest = (
    wcProposal: ProposalTypes.Struct
): Result<unknown, WalletConnectConnectionRequest> => {
    const metadata = wcProposal.proposer.metadata
    const id = wcProposal.id

    return shape({
        type: success('wallect_connect_session_proposal' as const),
        dAppInfo: shape({
            hostname: string(metadata.url).map((url) => new URL(url).hostname),
            avatar: nullableOf(metadata.icons[0], string),
            title: string(metadata.name),
        }),
        id: success(id),
        requiredNetworkHexIds: parseChainsIds(
            wcProposal.requiredNamespaces.eip155
        ).map((chains): NetworkHexId[] =>
            chains.length ? chains : ['0x1' as NetworkHexId]
        ),
        optionalNetworkHexIds: parseChainsIds(
            wcProposal.optionalNamespaces.eip155
        ),

        originalProposal: success(wcProposal),
    })
}
