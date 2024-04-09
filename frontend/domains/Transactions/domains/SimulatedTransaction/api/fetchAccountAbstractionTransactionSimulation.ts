import { post } from '@zeal/api/request'

import { notReachable } from '@zeal/toolkit'
import { bigIntToHex } from '@zeal/toolkit/BigInt'

import { DAppSiteInfo } from '@zeal/domains/DApp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network } from '@zeal/domains/Network'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'
import { InitialUserOperation } from '@zeal/domains/UserOperation'

import { parseSimulateTransactionResponse } from '../parsers/parseSimulateTransactionResponse'

export const fetchAccountAbstractionTransactionSimulation = async ({
    initialUserOperation,
    network,
    signal,
    dApp,
}: {
    initialUserOperation: InitialUserOperation
    network: Network
    dApp: DAppSiteInfo | null
    signal?: AbortSignal
}): Promise<SimulationResult> => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            return network.isSimulationSupported
                ? post(
                      '/wallet/user-ops-transaction/simulate',
                      {
                          query: { network: network.name },
                          body: {
                              callData: initialUserOperation.callData,
                              initCode: initialUserOperation.initCode,
                              nonce: bigIntToHex(initialUserOperation.nonce),
                              sender: initialUserOperation.sender,

                              callGasLimit: null,
                              maxFeePerGas: null,
                              maxPriorityFeePerGas: null,
                              paymasterAndData: null,
                              preVerificationGas: null,
                              signature: null,
                              verificationGasLimit: null,
                          },
                          requestSource: dApp?.hostname,
                      },
                      signal
                  )
                      .then((data) => {
                          const simulation = parseSimulateTransactionResponse(
                              data
                          ).getSuccessResultOrThrow(
                              'failed to parse simulation response'
                          )

                          return { type: 'simulated' as const, simulation }
                      })
                      .catch((e) => {
                          captureError(e)

                          return { type: 'failed' as const }
                      })
                : { type: 'not_supported' }
        case 'custom':
            return { type: 'not_supported' }

        default:
            return notReachable(network)
    }
}
