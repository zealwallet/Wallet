import {
    failure,
    match,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockLoginUserDidNotExists } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

const USER_DID_NOT_EXIST_MESSAGE_REGEXP = /^user not found/i

export const parseUnblockLoginError = (
    input: unknown
): Result<unknown, UnblockLoginUserDidNotExists> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                level: match(obj.level, 'error'),
                message: string(obj.message).andThen((msg) =>
                    msg.match(USER_DID_NOT_EXIST_MESSAGE_REGEXP)
                        ? success(msg)
                        : failure({
                              type: 'message_does_not_match_regexp',
                              msg,
                          })
                ),
                name: match(obj.name, 'AuthBadRequestError'),
            })
        )
        .map(() => ({ type: 'unblock_login_user_did_not_exists' } as const))
