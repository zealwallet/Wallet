import { failure, Result, success } from '@zeal/toolkit/Result'

import { PasskeySignerNotFoundError } from '@zeal/domains/Error'

export const parsePasskeySignerNotFoundError = (
    input: unknown
): Result<unknown, PasskeySignerNotFoundError> =>
    input instanceof PasskeySignerNotFoundError &&
    input.isPasskeySignerNotFoundError
        ? success(input)
        : failure('not_correct_instance')
