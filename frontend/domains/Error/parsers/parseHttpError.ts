import { failure, Result, success } from '@zeal/toolkit/Result'

import { HttpError } from '@zeal/domains/Error'

export const parseHttpError = (input: unknown): Result<unknown, HttpError> =>
    input instanceof HttpError && input.isHttpError
        ? success(input)
        : failure('not_correct_instance')
