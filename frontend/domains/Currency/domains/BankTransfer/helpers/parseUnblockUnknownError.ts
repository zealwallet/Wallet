import {
    match,
    object,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { UnknownUnblockError } from '@zeal/domains/Error'
import { parseHttpError } from '@zeal/domains/Error/parsers/parseHttpError'

export const parseUnknownUnblockError = (
    input: unknown
): Result<unknown, UnknownUnblockError> =>
    parseHttpError(input)
        .andThen((error) =>
            shape({
                url: match(error.url, '/wallet/unblock/'),
                data: object(error.data),
                httpError: success(error),
            })
        )
        .andThen(({ data, url, httpError }) =>
            shape({
                message: string(data.message),
                path: object(httpError.queryParams).andThen((query) =>
                    string(query.path)
                ),
                errorId: string(data.error_id),
            }).map(({ message, errorId, path }) => {
                const error = new UnknownUnblockError(
                    path,
                    httpError.method,
                    httpError.status,
                    httpError.trace,
                    errorId,
                    httpError.data,
                    message
                )
                error.stack = httpError.stack
                return error
            })
        )
