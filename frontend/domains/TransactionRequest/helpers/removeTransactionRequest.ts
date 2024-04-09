import { TransactionRequest } from '@zeal/domains/TransactionRequest'

export const removeTransactionRequest = <T extends TransactionRequest>(
    items: T[],
    toRemove: T
): T[] => items.filter((item) => item.rpcRequest.id !== toRemove.rpcRequest.id)
