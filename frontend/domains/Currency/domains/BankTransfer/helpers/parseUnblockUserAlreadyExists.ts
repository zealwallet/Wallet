import {
    failure,
    match,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockUserWithAddressAlreadyExists } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

const USER_ALREADY_EXISTS_MESSAGE_REGEXP = /^user with address/i

export const parseUnblockUserAlreadyExists = (
    input: unknown
): Result<unknown, UnblockUserWithAddressAlreadyExists> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                level: match(obj.level, 'error'),
                name: match(obj.name, 'UserAlreadyExistsError'),
                message: string(obj.message).andThen((msg) =>
                    msg.match(USER_ALREADY_EXISTS_MESSAGE_REGEXP)
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
                ({ type: 'unblock_user_with_address_already_exists' } as const)
        )
