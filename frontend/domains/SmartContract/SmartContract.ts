import { components } from '@zeal/api/portfolio'

import { NetworkHexId } from '@zeal/domains/Network'

export type SmartContract = Omit<
    components['schemas']['SmartContract'],
    'network'
> & { networkHexId: NetworkHexId }
