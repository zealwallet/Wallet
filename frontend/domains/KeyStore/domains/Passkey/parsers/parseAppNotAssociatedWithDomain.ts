import {
    failure,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { AppNotAssociatedWithDomain } from '@zeal/domains/Error'

// FIXME :: @Nicvaniek Android
export const parseAppNotAssociatedWithDomain = (
    input: unknown
): Result<unknown, AppNotAssociatedWithDomain> =>
    object(input)
        .andThen((obj) =>
            shape({
                message: string(obj.message).andThen((msg) =>
                    msg.match('is not associated with domain')
                        ? success(msg)
                        : failure({
                              type: 'message_does_not_match_regexp',
                              msg,
                          })
                ),
            })
        )
        .map(() => ({ type: 'app_not_associated_with_domain' }))
