import { notReachable } from '@zeal/toolkit'

import { CurrentNetwork } from '@zeal/domains/Network'

export const isEqual = (a: CurrentNetwork, b: CurrentNetwork): boolean => {
    switch (a.type) {
        case 'all_networks':
            switch (b.type) {
                case 'all_networks':
                    return true
                case 'specific_network':
                    return false
                /* istanbul ignore next */
                default:
                    return notReachable(b)
            }
        case 'specific_network':
            switch (b.type) {
                case 'all_networks':
                    return false
                case 'specific_network':
                    return b.network.hexChainId === a.network.hexChainId
                /* istanbul ignore next */
                default:
                    return notReachable(b)
            }
        /* istanbul ignore next */
        default:
            return notReachable(a)
    }
}
