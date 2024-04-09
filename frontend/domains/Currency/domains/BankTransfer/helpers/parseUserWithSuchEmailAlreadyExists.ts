import { match, object, Result, shape } from '@zeal/toolkit/Result'

import { UnblockUserWithSuchEmailAlreadyExists } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUserWithSuchEmailAlreadyExists = (
    input: unknown
): Result<unknown, UnblockUserWithSuchEmailAlreadyExists> =>
    parseHttpError(input)
        .andThen((error) =>
            shape({
                url: match(error.url, '/wallet/unblock/'), // TODO :: this should work with smart-wallet endpoint as well
                data: object(error.data).andThen((data) =>
                    match(data.name, 'EmailAlreadyExistsError')
                ),
                status: match(error.status, 409),
            })
        )
        .map(
            () =>
                ({
                    type: 'unblock_user_with_such_email_already_exists',
                } as const)
        )
