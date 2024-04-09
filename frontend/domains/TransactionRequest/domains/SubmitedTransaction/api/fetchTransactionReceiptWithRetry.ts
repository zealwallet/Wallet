import { notReachable } from '@zeal/toolkit'
import { delay } from '@zeal/toolkit/delay'
import { generateRandomNumber } from '@zeal/toolkit/Number'
import {
    bigint,
    match,
    nullable,
    object,
    oneOf,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchRPCResponse } from '@zeal/domains/RPCRequest/api/fetchRPCResponse'
import { GasInfo } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { parseGasInfo } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction/parsers/parseSubmitedTransaction'

type Receipt =
    | { status: 'not_found' }
    | {
          status: 'success' | 'failed'
          blockNumber: string
          gasInfo: ReceiptGasInfo
      }

export type ReceiptGasInfo = { type: 'no_gas_price'; gasUsed: bigint } | GasInfo

const parseReceiptGasInfo = (input: unknown): Result<unknown, ReceiptGasInfo> =>
    oneOf(input, [
        parseGasInfo(input),
        object(input).andThen((dto) =>
            shape({
                type: success('no_gas_price' as const),
                gasUsed: bigint(dto.gasUsed),
            })
        ),
    ])

const parseReceipt = (input: unknown): Result<unknown, Receipt> =>
    oneOf(input, [
        nullable(input).map(() => ({
            status: 'not_found' as const,
        })),
        object(input).andThen((dto) =>
            oneOf(dto, [
                shape({
                    status: match(dto.status, '0x1').map(
                        () => 'success' as const
                    ),
                    blockNumber: string(dto.blockNumber),
                    gasInfo: parseReceiptGasInfo(dto),
                }),
                shape({
                    status: match(dto.status, '0x0').map(
                        () => 'failed' as const
                    ),
                    blockNumber: string(dto.blockNumber),
                    gasInfo: parseReceiptGasInfo(dto),
                }),
            ])
        ),
    ])

const FETCH_TRANSACTION_RECEIPT_RETRY_DELAY_MS = 500
const FETCH_TRANSACTION_RECEIPT_RETRY_MAX_COUNT = 10

export const fetchTransactionReceiptWithRetry = async ({
    network,
    networkRPCMap,
    transactionHash,
    retriesDone,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    transactionHash: string
    retriesDone: number
}): Promise<Receipt> => {
    const receiptResponse = await fetchRPCResponse({
        network,
        networkRPCMap,
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
        },
    })

    const receipt = await parseReceipt(receiptResponse).getSuccessResultOrThrow(
        'failed to parse eth_getTransactionReceipt'
    )

    switch (receipt.status) {
        case 'not_found':
            if (retriesDone >= FETCH_TRANSACTION_RECEIPT_RETRY_MAX_COUNT) {
                return receipt
            }

            await delay(FETCH_TRANSACTION_RECEIPT_RETRY_DELAY_MS)

            return fetchTransactionReceiptWithRetry({
                network,
                networkRPCMap,
                transactionHash,
                retriesDone: retriesDone + 1,
            })

        case 'success':
        case 'failed':
            return receipt

        default:
            return notReachable(receipt)
    }
}

export const getConfirmationBlockCount = (network: Network): bigint => {
    switch (network.type) {
        case 'predefined':
        case 'testnet':
            switch (network.name) {
                case 'EthereumGoerli':
                case 'EthereumSepolia':
                case 'Ethereum':
                case 'Arbitrum':
                case 'zkSync':
                case 'BSC':
                case 'Fantom':
                case 'Optimism':
                case 'Base':
                case 'Gnosis':
                case 'Celo':
                case 'Avalanche':
                case 'Cronos':
                case 'Aurora':
                case 'AuroraTestnet':
                case 'BscTestnet':
                case 'AvalancheFuji':
                case 'OptimismGoerli':
                case 'FantomTestnet':
                case 'ArbitrumGoerli':
                    return 0n // initial confirmation not included in the confirmation count. i.e. 0=1 and 1=2
                case 'PolygonMumbai':
                case 'Polygon':
                case 'PolygonZkevm':
                    return 1n
                default:
                    return notReachable(network)
            }
        case 'custom':
            return 1n
        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
