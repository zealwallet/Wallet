import { TransactionRequest } from '@zeal/domains/TransactionRequest'

export const removeTransactionRequest = <T extends TransactionRequest>(
    items: T[] | null,
    toRemove: T
): T[] =>
    items
        ? items.filter((item) => item.rpcRequest.id !== toRemove.rpcRequest.id)
        : []
