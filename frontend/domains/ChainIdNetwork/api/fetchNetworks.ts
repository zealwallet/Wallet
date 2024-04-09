import { get } from '@zeal/api/chainIdNetwork'

import {
    array,
    groupByType,
    UnexpectedResultFailureError,
} from '@zeal/toolkit/Result'

import { ChainIdNetwork } from '@zeal/domains/ChainIdNetwork'
import { parseNetworks } from '@zeal/domains/ChainIdNetwork/helpers/parseNetworks'
import { captureError } from '@zeal/domains/Error/helpers/captureError'

export const fetchNetworks = (): Promise<ChainIdNetwork[]> =>
    get('/chains.json').then((response) => {
        const rawChains = array(response).getSuccessResultOrThrow(
            'Failed to parse array of networks'
        )

        const [errors, chains] = groupByType(rawChains.map(parseNetworks))

        if (errors.length > 0) {
            captureError(
                new UnexpectedResultFailureError(
                    'Some chains.json networks could not be parsed',
                    errors
                )
            )
        }

        return chains
    })
