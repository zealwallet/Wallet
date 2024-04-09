import {
    failure,
    Result,
    success,
    UnexpectedResultFailureError,
} from '@zeal/toolkit/Result'

import { UnexpectedFailureError } from '@zeal/domains/Error'

export const parseUnexpectedFailureError = (
    input: unknown
): Result<unknown, UnexpectedFailureError> =>
    input instanceof UnexpectedResultFailureError &&
    input.isUnexpectedResultFailureError
        ? success({ type: 'unexpected_failure', error: input })
        : failure('not_correct_instance')
