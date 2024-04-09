import { failure, Result, success } from '@zeal/toolkit/Result'

import { RPCRequestParseError } from '../RPCRequestParseError'

export const parseRPCRequestParseError = (
    input: unknown
): Result<unknown, RPCRequestParseError> =>
    input instanceof RPCRequestParseError && input.isRPCRequestParseError
        ? success(input)
        : failure('not_correct_instance')
