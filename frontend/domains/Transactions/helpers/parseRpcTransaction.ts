import { bigint, object, Result, shape } from '@zeal/toolkit/Result'

import { RpcTransaction } from '@zeal/domains/Transactions'

export const parseRpcTransaction = (
    input: unknown
): Result<unknown, RpcTransaction> =>
    object(input).andThen((obj) =>
        shape({
            nonce: bigint(obj.nonce),
            blockNumber: bigint(obj.blockNumber),
        })
    )
