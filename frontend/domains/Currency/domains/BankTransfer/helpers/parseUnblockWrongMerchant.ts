import {
    failure,
    match,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockUserAssociatedWithOtherMerchant } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

const USER_ALREADY_EXISTS_MESSAGE_REGEXP =
    /^user with uuid.*not associated with the given merchant/i

export const parseUnblockUserAssociatedWithOtherMerchant = (
    input: unknown
): Result<unknown, UnblockUserAssociatedWithOtherMerchant> =>
    parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                level: match(obj.level, 'error'),
                name: match(obj.name, 'UserNotAssociatedWithMerchant'),
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
                ({
                    type: 'unblock_user_associated_with_other_merchant',
                } as const)
        )
