import {
    combine,
    failure,
    minStringLength,
    MinStringLengthError,
    numberString,
    Result,
    success,
} from '@zeal/toolkit/Result'

export type Password = string

export type Pin = `${number}${number}${number}${number}`

const LOW_AND_UPPER_CASE = new RegExp('(?=.*[a-z])(?=.*[A-Z])')

export type ShouldContainLowerAndUpperCase = {
    type: 'should_contain_lower_and_upper_case'
}

export const includeLowerAndUppercase = (
    password: string
): Result<ShouldContainLowerAndUpperCase, string> => {
    return LOW_AND_UPPER_CASE.test(password)
        ? success(password)
        : failure({ type: 'should_contain_lower_and_upper_case' })
}

const CONTAINS_NUMBER = new RegExp('.*\\d')
const CONTAINS_SPECIAL_CHAR = new RegExp(
    '.*[!"#$%&\'\\(\\)*+,-\\.\\/:;<=>?@\\[\\]^_`{|}~]'
)

export type ShouldContainNumberOrSpecialChar = {
    type: 'should_contain_number_or_special_char'
}

export const includesNumberOrSpecialChar = (
    password: string
): Result<ShouldContainNumberOrSpecialChar, string> => {
    return CONTAINS_NUMBER.test(password) ||
        CONTAINS_SPECIAL_CHAR.test(password)
        ? success(password)
        : failure({
              type: 'should_contain_number_or_special_char',
          })
}

export const shouldContainsMinChars = (
    password: string
): Result<MinStringLengthError, string> => minStringLength(10, password)

export type ValidatePinError =
    | { type: 'wrong_pin_length' }
    | { type: 'wrong_characters_in_pin' } // Explicitly do not log the character so it won't be reported by accident

export const PIN_LENGTH = 4

export const validatePin = (input: string): Result<ValidatePinError, Pin> => {
    return input.length !== PIN_LENGTH
        ? failure({ type: 'wrong_pin_length' })
        : combine(Array.from(input).map((digit) => numberString(digit)))
              .mapError(() => ({ type: 'wrong_characters_in_pin' as const }))
              .map(([a, b, c, d]) => `${a}${b}${c}${d}` as const)
}
