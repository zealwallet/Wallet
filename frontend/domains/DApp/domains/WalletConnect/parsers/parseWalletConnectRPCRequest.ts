import { SessionTypes } from '@walletconnect/types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'

import { values } from '@zeal/toolkit/Object'
import {
    failure,
    nullableOf,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import {
    parseEthSendTransaction,
    parseEthSignTypedData,
    parseEthSignTypedDataV3,
    parseEthSignTypedDataV4,
    parsePersonalSign,
} from '@zeal/domains/RPCRequest/parsers/parseRPCRequest'

import { WalletConnectRPCRequest } from '..'

export const parseWalletConnectRPCRequest = ({
    activeSessions,
    wcRequest,
}: {
    activeSessions: Record<string, SessionTypes.Struct>
    wcRequest: Web3WalletTypes.SessionRequest
}): Result<unknown, WalletConnectRPCRequest> => {
    const request = {
        jsonrpc: '2.0',
        id: wcRequest.id,
        method: wcRequest.params.request.method,
        params: wcRequest.params.request.params,
    }

    // Update this parser if type changes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const supportedMethods: Record<
        WalletConnectRPCRequest['rpcRequest']['method'],
        true
    > = {
        eth_sendTransaction: true,
        eth_signTypedData: true,
        eth_signTypedData_v3: true,
        eth_signTypedData_v4: true,
        personal_sign: true,
    }

    return shape({
        rpcRequest: oneOf(request, [
            parseEthSendTransaction(request),
            parseEthSignTypedData(request),
            parseEthSignTypedDataV3(request),
            parseEthSignTypedDataV4(request),
            parsePersonalSign(request),
        ]),
        networkHexId: parseNetworkHexId(
            wcRequest.params.chainId.replace('eip155:', '')
        ),
        sessionData: parseSessionByRequest({ activeSessions, wcRequest }),
    }).map(({ networkHexId, rpcRequest, sessionData }) => ({
        type: 'session_request' as const,
        networkHexId,
        id: rpcRequest.id,
        rpcRequest,
        originalRequest: wcRequest,
        address: sessionData.address,
        dAppInfo: sessionData.dAppInfo,
    }))
}

const parseSessionByRequest = ({
    activeSessions,
    wcRequest,
}: {
    activeSessions: Record<string, SessionTypes.Struct>
    wcRequest: Web3WalletTypes.SessionRequest
}): Result<unknown, { address: Address; dAppInfo: DAppSiteInfo }> => {
    const session =
        values(activeSessions).find(
            (session) => session.topic === wcRequest.topic
        ) || null

    return session
        ? shape({
              address: parseAddressFromSession({ session }),

              dAppInfo: shape({
                  hostname: string(session.peer.metadata.url).map(
                      (url) => new URL(url).hostname
                  ),
                  avatar: nullableOf(session.peer.metadata.icons[0], string),
                  title: string(session.peer.metadata.name),
              }),
          })
        : failure({ type: 'failed_to_find_session_for_request' })
}

export const parseAddressFromSession = ({
    session,
}: {
    session: SessionTypes.Struct
}): Result<unknown, Address> => {
    const addresses = session.namespaces.eip155.accounts.map(
        (eip155Account) => eip155Account.split(':')[2]
    )

    const uniqAddresses = new Set(addresses)
    return uniqAddresses.size === 1
        ? fromString(addresses[0])
        : failure({ type: 'multiple_addresses_in_session' })
}
