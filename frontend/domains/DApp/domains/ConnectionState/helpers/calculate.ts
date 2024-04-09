import { notReachable } from '@zeal/toolkit'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'

import { knownHosts } from './knownHosts'

import {
    Connected,
    ConnectedToMetaMask,
    ConnectionState,
    Disconnected,
} from '../index'

type Params = {
    dApps: Record<
        DAppSiteInfo['hostname'],
        Connected | Disconnected | ConnectedToMetaMask
    >
    hostname: DAppSiteInfo['hostname']
}

export const calculate = ({ dApps, hostname }: Params): ConnectionState => {
    const connectionState = dApps[hostname]
    if (connectionState) {
        switch (connectionState.type) {
            case 'connected_to_meta_mask':
            case 'disconnected':
            case 'connected':
                return connectionState
            /* istanbul ignore next */
            default:
                return notReachable(connectionState)
        }
    } else if (knownHosts.includes(hostname)) {
        return {
            type: 'disconnected',
            dApp: {
                hostname,
                title: null,
                avatar: null,
            },
            networkHexId: DEFAULT_NETWORK.hexChainId,
        }
    } else {
        return {
            type: 'not_interacted',
            dApp: {
                hostname,
                title: null,
                avatar: null,
            },
        }
    }
}
