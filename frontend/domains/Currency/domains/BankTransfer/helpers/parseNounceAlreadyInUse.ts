import {
    failure,
    match,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockNonceAlreadyInUse } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

const NONCE_ALREADY_IN_USE_MESSAGE_REGEXP = /^Given nonce is already in use/i

export const parseNonceAlreadyInUse = (
    input: unknown
): Result<unknown, UnblockNonceAlreadyInUse> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                level: match(obj.level, 'error'),
                name: match(obj.name, 'AuthBadRequestError'),
                message: string(obj.message).andThen((msg) =>
                    msg.match(NONCE_ALREADY_IN_USE_MESSAGE_REGEXP)
                        ? success(msg)
                        : failure({
                              type: 'message_does_not_match_regexp',
                              msg,
                          })
                ),
            })
        )
        .map(
            () =>
                ({
                    type: 'unblock_nonce_already_in_use',
                } as const)
        )
