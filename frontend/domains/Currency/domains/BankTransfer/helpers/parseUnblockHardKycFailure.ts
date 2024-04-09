import {
    failure,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnblockHardKycFailure } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUnblockHardKycFailure = (
    input: unknown
): Result<unknown, UnblockHardKycFailure> => {
    return parseHttpError(input)
        .map((err) => err.data)
        .andThen((data) => object(data))
        .andThen((obj) =>
            shape({
                error: string(obj.error).andThen((msg) =>
                    msg.match('KYC status for user is HARD_KYC_FAILED')
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
                    type: 'unblock_hard_kyc_failure',
                } as const)
        )
}
