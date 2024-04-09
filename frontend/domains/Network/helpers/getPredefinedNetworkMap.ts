import { NetworkMap } from '@zeal/domains/Network'
import {
    PREDEFINED_NETWORKS,
    TEST_NETWORKS,
} from '@zeal/domains/Network/constants'

export const getPredefinedNetworkMap = () => {
    return [...TEST_NETWORKS, ...PREDEFINED_NETWORKS].reduce((result, item) => {
        return {
            ...result,
            [item.hexChainId]: item,
        }
    }, {} as NetworkMap)
}
