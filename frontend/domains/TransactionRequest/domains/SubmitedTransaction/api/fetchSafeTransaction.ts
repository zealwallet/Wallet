import { notReachable } from '@zeal/toolkit'
import { delay } from '@zeal/toolkit/delay'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    bigint,
    nullable,
    nullableOf,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchBlockTimestamp } from '@zeal/domains/RPCRequest/api/fetchBlockTimestamp'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { SubmittedSafeTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

import {
    fetchTransactionReceiptWithRetry,
    getConfirmationBlockCount,
} from './fetchTransactionReceiptWithRetry'

type RPCTransactionInfo =
    | {
          status: 'included'
          blockNumber: string
          gasPrice: bigint
      }
    | { status: 'pending' }

const parseTransactionInfo = (
    input: unknown
): Result<unknown, RPCTransactionInfo> =>
    oneOf(input, [
        object(input).andThen((dto) =>
            shape({
                blockNumber: string(dto.blockNumber),
                status: success('included' as const),
                gasPrice: bigint(dto.gasPrice),
            })
        ),
        object(input)
            .andThen((dto) =>
                shape({
                    blockNumber: nullable(dto.blockNumber),
                    status: success('pending' as const),
                })
            )
            .map(({ status }) => ({ status })),
    ])

type Params = {
    transaction: SubmittedSafeTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
}

const FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS = 3000
const FETCH_TRANSACTION_BY_HASH_RETRY_COUNT_TO_REPORT = 15

const fetchTransactionByHashWithRetry = async ({
    network,
    networkRPCMap,
    transaction,
    retriesDone,
}: Params & { retriesDone: number }): Promise<RPCTransactionInfo> => {
    const response = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transaction.hash],
        },
    })

    const info = nullableOf(
        response,
        parseTransactionInfo
    ).getSuccessResultOrThrow('failed to parse safe eth_getTransactionByHash')

    if (!info) {
        await delay(FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS)

        if (retriesDone === FETCH_TRANSACTION_BY_HASH_RETRY_COUNT_TO_REPORT) {
            captureError(
                new ImperativeError(
                    'Safe transaction `not_found` after all reties'
                )
            )
        }

        return fetchTransactionByHashWithRetry({
            network,
            networkRPCMap,
            transaction,
            retriesDone: retriesDone + 1,
        })
    }

    return info
}

export const fetchSafeTransaction = async ({
    network,
    networkRPCMap,
    transaction,
}: Params): Promise<SubmittedSafeTransaction> => {
    const transactionInfoResponse = await fetchTransactionByHashWithRetry({
        network,
        networkRPCMap,
        transaction,
        retriesDone: 0,
    })

    switch (transactionInfoResponse.status) {
        case 'pending':
            return {
                state: 'queued',
                hash: transaction.hash,
                queuedAt: transaction.queuedAt,
            }

        case 'included':
            const receipt = await fetchTransactionReceiptWithRetry({
                network,
                networkRPCMap,
                transactionHash: transaction.hash,
                retriesDone: 0,
            })

            switch (receipt.status) {
                case 'not_found':
                    throw new ImperativeError(
                        `Safe transaction eth_getTransactionReceipt not found after included in block (network: ${network.name}, ${network.hexChainId})`
                    )

                case 'success': {
                    const expectedBlockNumber =
                        BigInt(receipt.blockNumber) +
                        getConfirmationBlockCount(network)

                    const currentBlockResponse = await fetchRPCResponse({
                        network,
                        networkRPCMap,
                        request: {
                            id: generateRandomNumber(),
                            jsonrpc: '2.0',
                            method: 'eth_blockNumber',
                            params: [],
                        },
                    })

                    const currentBlock = bigint(
                        currentBlockResponse
                    ).getSuccessResultOrThrow(
                        'failed to parse safe eth_blockNumber during confirmation check'
                    )

                    if (currentBlock < expectedBlockNumber) {
                        return {
                            state: 'included_in_block',
                            hash: transaction.hash,
                            queuedAt: transaction.queuedAt,
                        }
                    }

                    const blockTimestamp = await fetchBlockTimestamp({
                        network,
                        networkRPCMap,
                        blockNumber: `0x${expectedBlockNumber.toString(16)}`,
                    })

                    return {
                        state: 'completed',
                        hash: transaction.hash,
                        queuedAt: transaction.queuedAt,
                        completedAt: blockTimestamp,
                    }
                }

                case 'failed': {
                    const blockTimestamp = await fetchBlockTimestamp({
                        network,
                        networkRPCMap,
                        blockNumber: receipt.blockNumber,
                    })
                    return {
                        state: 'failed',
                        hash: transaction.hash,
                        queuedAt: transaction.queuedAt,
                        failedAt: blockTimestamp,
                    }
                }

                default:
                    return notReachable(receipt)
            }

        default:
            return notReachable(transactionInfoResponse)
    }
}
