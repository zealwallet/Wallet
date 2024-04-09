import {
    failure,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockInvalidIBAN } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUnblockInvalidIBAN = (
    input: unknown
): Result<unknown, UnblockInvalidIBAN> => {
    return parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((data) => object(data.error))
        .andThen((obj) => {
            return shape({
                message: string(obj.error).andThen((msg) =>
                    msg.match('BENEFICIARY_DETAILS_INVALID') &&
                    msg.match('iban_invalid')
                        ? success(msg)
                        : failure({
                              type: 'message_does_not_match_regexp',
                              msg,
                          })
                ),
            })
        })
        .map(
            () =>
                ({
                    type: 'unblock_invalid_iban',
                } as const)
        )
}
