import { notReachable } from '@zeal/toolkit'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectionState } from '@zeal/domains/DApp/domains/ConnectionState'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { Storage } from '@zeal/domains/Storage'

export const updateDAppInfo = (
    dAppInfo: DAppSiteInfo,
    storage: Storage,
    connectionState: ConnectionState
): Storage => {
    if (connectionState.dApp.hostname !== dAppInfo.hostname) {
        captureError(new ImperativeError('Iframe URL and Check not matching'), {
            extra: {
                dAppUrl: connectionState.dApp.hostname,
                msg: dAppInfo.hostname,
            },
        })
        return storage
    }

    switch (connectionState.type) {
        case 'not_interacted':
            return {
                ...storage,
                dApps: {
                    ...storage.dApps,
                    [dAppInfo.hostname]: {
                        type: 'disconnected',
                        dApp: dAppInfo,
                        networkHexId: DEFAULT_NETWORK.hexChainId,
                    },
                },
            }
        case 'disconnected':
        case 'connected':
        case 'connected_to_meta_mask':
            return {
                ...storage,
                dApps: {
                    ...storage.dApps,
                    [dAppInfo.hostname]: {
                        ...connectionState,
                        dApp: dAppInfo,
                    },
                },
            }
        /* istanbul ignore next */
        default:
            return notReachable(connectionState)
    }
}
