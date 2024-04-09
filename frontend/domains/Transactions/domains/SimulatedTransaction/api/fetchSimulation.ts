import { post } from '@zeal/api/request'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { parseSimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction/parsers/parseSimulateTransactionResponse'

import { SimulateTransactionResponse } from '../SimulateTransactionResponse'

export type SimulationResult =
    | { type: 'failed' }
    | { type: 'not_supported' }
    | {
          type: 'simulated'
          simulation: SimulateTransactionResponse
      }

export const fetchSimulationByRequest = ({
    network,
    rpcRequest,
    dApp,
}: {
    network: Network
    rpcRequest: EthSendTransaction
    dApp: DAppSiteInfo | null
}): Promise<SimulationResult> => {
    if (!network.isSimulationSupported) {
        return Promise.resolve({ type: 'not_supported' })
    }

    return post('/wallet/transaction/simulate/', {
        query: { network: network.name },
        body: rpcRequest.params[0],
        requestSource: dApp?.hostname,
    })
        .then((data) => {
            const simulation = parseSimulateTransactionResponse(
                data
            ).getSuccessResultOrThrow('failed to parse simulation response')

            return { type: 'simulated' as const, simulation }
        })
        .catch((e) => {
            captureError(e)

            return { type: 'failed' as const }
        })
}
