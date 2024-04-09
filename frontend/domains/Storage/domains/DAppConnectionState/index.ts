import {
    match,
    nullable,
    number,
    object,
    oneOf,
    Result,
    shape,
    string,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { NetworkHexId } from '@zeal/domains/Network'
import { parse as parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

export type DAppConnectionState =
    | DAppConnected
    | DAppDisconnected
    | ConnectedToMetaMask

export type ConnectedToMetaMask = {
    type: 'connected_to_meta_mask'
    dApp: DAppSiteInfo
}
export const parseDAppConnectionState = (
    input: unknown
): Result<unknown, DAppConnectionState> =>
    object(input).andThen((obj) =>
        oneOf(obj, [
            parseDAppConnected(obj),
            parseDAppDisconnected(obj),
            parseConnectedToMetaMask(obj),
        ])
    )

type DApp = {
    title: string | null
    avatar: string | null
    hostname: string
}

export const parseConnectedToMetaMask = (
    input: Record<string, unknown>
): Result<unknown, ConnectedToMetaMask> =>
    shape({
        type: match(input.type, 'connected_to_meta_mask'),
        dApp: parseDApp(input.dApp),
    })

export const parseDApp = (input: unknown): Result<unknown, DApp> =>
    object(input).andThen((obj) =>
        shape({
            title: oneOf(obj.title, [string(obj.title), nullable(obj.title)]),
            avatar: oneOf(obj.avatar, [
                string(obj.avatar),
                nullable(obj.avatar),
            ]),
            hostname: string(obj.hostname),
        })
    )

export type DAppDisconnected = {
    type: 'disconnected'
    dApp: DApp
    networkHexId: NetworkHexId
}

export const parseDAppDisconnected = (
    input: Record<string, unknown>
): Result<unknown, DAppDisconnected> =>
    shape({
        type: match(input.type, 'disconnected'),
        dApp: parseDApp(input.dApp),
        networkHexId: oneOf(input, [
            parseNetworkHexId(input.networkHexId),
            parseNetworkHexId(input.network), // We try to parse networkHexId from old network type stored in storage
        ]),
    })

export type DAppConnected = {
    type: 'connected'
    dApp: DApp
    networkHexId: NetworkHexId
    address: Address
    connectedAtMs: number
}

export const parseDAppConnected = (
    input: Record<string, unknown>
): Result<unknown, DAppConnected> =>
    shape({
        type: match(input.type, 'connected'),
        dApp: parseDApp(input.dApp),
        networkHexId: oneOf(input, [
            parseNetworkHexId(input.networkHexId),
            parseNetworkHexId(input.network), // We try to parse networkHexId from old network type stored in storage
        ]),
        address: parseAddress(input.address),
        connectedAtMs: number(input.connectedAtMs),
    })
