import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'

import {
    NotValidPrivateKey,
    validatePrivateKey,
} from '@zeal/domains/KeyStore/helpers/validatePrivateKey'

export type ValidationError = {
    submitButton?: EmptyStringError
    inputIcon?: NotValidPrivateKey | EmptyStringError
    inputMessage?: NotValidPrivateKey
}

export const validateAsYouType = (
    input: string
): Result<ValidationError, unknown> =>
    shape({
        inputIcon: nonEmptyString(input).andThen(validatePrivateKey),
        submitButton: nonEmptyString(input),
    })

export const validateOnSubmit = (
    input: string
): Result<ValidationError, string> =>
    shape({
        submitButton: nonEmptyString(input),
        inputIcon: nonEmptyString(input).andThen(validatePrivateKey),
        inputMessage: validatePrivateKey(input),
        privateKey: nonEmptyString(input).andThen(validatePrivateKey),
    }).map(({ privateKey }) => privateKey)
