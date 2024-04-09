import { notReachable } from '@zeal/toolkit'
import { delay } from '@zeal/toolkit/delay'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    bigint,
    nullable,
    nullableOf,
    numberString,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchBlockTimestamp } from '@zeal/domains/RPCRequest/api/fetchBlockTimestamp'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'

import {
    fetchTransactionReceiptWithRetry,
    getConfirmationBlockCount,
    ReceiptGasInfo,
} from './fetchTransactionReceiptWithRetry'

import { GasInfo, SubmitedTransaction } from '../SubmitedTransaction'

type RPCTransactionInfo =
    | {
          status: 'included'
          blockNumber: string
          gasPrice: bigint
      }
    | { status: 'pending' }
    | { status: 'replaced'; transactionCount: number }

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

const enrichGasInfo = async ({
    gasInfo,
    network,
    networkRPCMap,
    transaction,
}: {
    transaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    gasInfo: ReceiptGasInfo
}): Promise<GasInfo> => {
    switch (gasInfo.type) {
        case 'generic':
            return gasInfo

        case 'no_gas_price': {
            // IF we don't have gasPrice from transaction, we query current gas price from RPC
            const currentGasPrice = bigint(
                await fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_gasPrice',
                        params: [],
                    },
                })
            ).getSuccessResultOrThrow('Failed to parse current gas price')

            return {
                type: 'generic',
                effectiveGasPrice: currentGasPrice,
                gasUsed: gasInfo.gasUsed,
            }
        }

        case 'l2_rollup':
            const transactionByHash = parseTransactionInfo(
                await fetchRPCResponse({
                    network,
                    networkRPCMap,
                    request: {
                        id: generateRandomNumber(),
                        jsonrpc: '2.0',
                        method: 'eth_getTransactionByHash',
                        params: [transaction.hash],
                    },
                })
            ).getSuccessResultOrThrow(
                'failed to parse eth_getTransactionByHash while enriching gasInfo for L2 Rollup'
            )
            switch (transactionByHash.status) {
                case 'pending':
                case 'replaced':
                    throw new ImperativeError(
                        `Impossible to have transaction by hash missing during gasInfo enrich`,
                        { status: transactionByHash.status }
                    )

                case 'included':
                    return {
                        ...gasInfo,
                        l2GasPrice: transactionByHash.gasPrice,
                    }
                default:
                    return notReachable(transactionByHash)
            }

        default:
            return notReachable(gasInfo)
    }
}

const fetchTransactionCount = async ({
    address,
    network,
    networkRPCMap,
}: {
    address: Address
    network: Network
    networkRPCMap: NetworkRPCMap
}): Promise<number> =>
    fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [address, 'latest'],
        },
    }).then((data) =>
        numberString(data).getSuccessResultOrThrow(
            'failed to parse latest nonce when fetching transaction'
        )
    )

/**
 * https://mermaid.live/edit#pako:eNqdVVFv2jAQ_iuW--JqRVCxl0VbpUG1rg9j1cqewjSZ5EKsOnZmOwNU9b_XiWMSQtgoSCTns7_v7j6f42ccyRhwgFeK5ima3y4Esj8m8sIQklKdXl46132WS63ZkgMh81TJdTnhprTZckBztbkXES9iiFHCOA8ukg_JlTZKPkFwMR6Pa3uwZrFJg_f5poN-ABEzsToPPKUiAs7Pjf2FsrOxU5nlHMwb4C2R0WBwY3FKmzswk-1Xq3g4BJP-XoGZKyo0jQyTws0Mfznk_voeilnBeSjs42SAnHAZPYXL8jkrsiUoxDR6C4X993LkCjQIK08vUR244mt6gJDcGb77DsvziN3GExJ506P6sD7NCm9F_gERsNz0iV5Plao7pj8FqO33tWgIZD3oCn585ZxloA3N8tB6UKUVMt5Xo9usFbg5fO3Cmuw7xXSzObrw0VBT6FGoqzcabUYfl-pmRfVPDXFpQpKA1eIv3FH9oFgEB4w1RUW8V_VO0Wo02bqOGJ6W0nWT0vWJKR0I7DvEnW1CkupdUrQ6tBy6ic8GfUI9e_K_8PvNtr8JvZt3UGuj3VQK263ZP_QrM3w3G7bbrA3qp-rtzu4CL5f_iBPiLV_hidF238OwyhV11HbObssfZ9kddO-wB92bDV8nyG6F39V2yNN2FF_hDFRGWWyvx-fSs8AmhQwWOLBmDAktuFnghXixS2lh5ONWRDgwqoArXOQxNXDLqL1YMxwklGvrhZgZqb65K7e6eV9eAW84oTs
 */

type Params = {
    transaction: SubmitedTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    account: Account
}

const FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS = 2000
const RETRY_COUNT_BEFORE_REPORT = 15
const RETRY_COUNT_BEFORE_REPLACE_CHECK = 1
/**
 * For some networks and RPC implementations due to race condition there is some gap between
 * eth_sendTransactionRaw and eth_getTransactionByHash returning non-null value.
 * This is dirty fix to "ensure" that the "notfound"/"cancel" we receive from RPC is not just sync gap
 * This fix is not affecting user, since users should rarely see this status in the app/widget, 3s ensurance will not change much
 */
const fetchTransactionByHashWithRetry = async ({
    network,
    networkRPCMap,
    transaction,
    retriesDone,
    account,
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
    ).getSuccessResultOrThrow('failed to parse eth_getTransactionByHash')

    if (!info) {
        // We retry before checking replacement because eth_getTransactionCount sometimes returns the updated nonce before eth_getTransactionByHash returns the transaction
        if (retriesDone === RETRY_COUNT_BEFORE_REPLACE_CHECK) {
            const transactionCount = await fetchTransactionCount({
                network,
                networkRPCMap,
                address: account.address,
            })

            if (transaction.submittedNonce < transactionCount) {
                return {
                    status: 'replaced',
                    transactionCount: transactionCount,
                }
            }
        }

        await delay(FETCH_TRANSACTION_BY_HASH_RETRY_DELAY_MS)

        if (retriesDone === RETRY_COUNT_BEFORE_REPORT) {
            captureError(
                new ImperativeError('Transaction `not_found` after all reties')
            )
        }

        return fetchTransactionByHashWithRetry({
            network,
            networkRPCMap,
            transaction,
            account,
            retriesDone: retriesDone + 1,
        })
    }

    return info
}

export const fetchTransaction = async ({
    network,
    networkRPCMap,
    transaction,
    account,
}: Params): Promise<SubmitedTransaction> => {
    const transactionInfoResponse = await fetchTransactionByHashWithRetry({
        network,
        networkRPCMap,
        transaction,
        account,
        retriesDone: 0,
    })

    switch (transactionInfoResponse.status) {
        case 'pending':
            return {
                state: 'queued',
                hash: transaction.hash,
                submittedNonce: transaction.submittedNonce,
                queuedAt: transaction.queuedAt,
            }

        case 'replaced':
            return {
                state: 'replaced',
                submittedNonce: transaction.submittedNonce,
                queuedAt: transaction.queuedAt,
                hash: transaction.hash,
                transactionCount: transactionInfoResponse.transactionCount,
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
                        `eth_getTransactionReceipt not found after included in block`,
                        { name: network.name, id: network.hexChainId }
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
                        'failed to parse eth_blockNumber during confirmation check'
                    )

                    const gasInfo = await enrichGasInfo({
                        gasInfo: receipt.gasInfo,
                        network,
                        networkRPCMap,
                        transaction,
                    })

                    if (currentBlock < expectedBlockNumber) {
                        return {
                            state: 'included_in_block',
                            gasInfo,
                            hash: transaction.hash,
                            submittedNonce: transaction.submittedNonce,
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
                        gasInfo,
                        hash: transaction.hash,
                        submittedNonce: transaction.submittedNonce,
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
                        gasInfo: await enrichGasInfo({
                            gasInfo: receipt.gasInfo,
                            network,
                            networkRPCMap,
                            transaction,
                        }),
                        hash: transaction.hash,
                        submittedNonce: transaction.submittedNonce,
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
