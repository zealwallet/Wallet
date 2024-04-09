import {
    failure,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockBvnDoesNotMatch } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUnblockBvnDoesNotMatch = (
    input: unknown
): Result<unknown, UnblockBvnDoesNotMatch> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                error: object(obj.error).andThen((errorObj) =>
                    string(errorObj.error).andThen((message) =>
                        message.match('UNPROCESSABLE_ENTITY') &&
                        message.match(/BVN doesn't match/)
                            ? success(message)
                            : failure('message_does_not_match_regexp')
                    )
                ),
            })
        )
        .map(() => ({ type: 'unblock_bvn_does_not_match' } as const))
