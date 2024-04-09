import { Address } from '@zeal/domains/Address'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { NetworkHexId } from '@zeal/domains/Network'

export type ConnectionState =
    | NotInteracted
    | Disconnected
    | Connected
    | ConnectedToMetaMask

export type NotInteracted = {
    type: 'not_interacted'
    dApp: DAppSiteInfo
}

export type Disconnected = {
    type: 'disconnected'
    dApp: DAppSiteInfo
    networkHexId: NetworkHexId
}

export type Connected = {
    type: 'connected'
    dApp: DAppSiteInfo
    address: Address
    networkHexId: NetworkHexId
    connectedAtMs: number
}

export type ConnectedToMetaMask = {
    type: 'connected_to_meta_mask'
    dApp: DAppSiteInfo
}

type HostName = string
export type ConnectionMap = Record<HostName, ConnectionState>
