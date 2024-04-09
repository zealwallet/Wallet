import {
    failure,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockUnableToVerifyBVN } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUnblockUnableToVerifyBVN = (
    input: unknown
): Result<unknown, UnblockUnableToVerifyBVN> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                error: object(obj.error).andThen((errorObj) =>
                    string(errorObj.error).andThen((message) =>
                        message.match('UNPROCESSABLE_ENTITY') &&
                        message.match(/unable to verify this bvn/)
                            ? success(message)
                            : failure('message_does_not_match_regexp')
                    )
                ),
            })
        )
        .map(() => ({ type: 'unblock_unable_to_verify_bvn' } as const))
