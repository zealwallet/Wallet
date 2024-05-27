import { isValid } from 'date-fns'

import { failure, Result, success } from './Result'

import { isNonEmptyArray, NonEmptyArray } from '../NonEmptyArray'

export type ValidObject = Record<string | number | symbol, unknown>
/**
 * Checks that input value is an object with keys as strings, numbers or symbols and unknown values
 * Usefull for nested objects to check shape after checking that it's actually and object
 */
export const object = <E = { type: 'value_is_not_an_object'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, ValidObject> => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        return success(value as Record<string | number | symbol, unknown>) // We can remove cast after https://github.com/microsoft/TypeScript/issues/38801
    }
    return failure(
        error ??
        ({
            type: 'value_is_not_an_object',
            value,
        } as E),
    )
}


/**
 * Checks that input value is an array
 */
export const array = <E = { type: 'value_is_not_an_array'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, unknown[]> =>
    Array.isArray(value)
        ? success(value as unknown[])
        : failure(
            error ??
            ({
                type: 'value_is_not_an_array',
                value,
            } as E),
        )

/**
 * Checks that value is string
 */
type ValueIsNotAString = { type: 'value_is_not_a_string'; value: unknown }
export const string = <E = ValueIsNotAString>(
    value: unknown,
    error?: E,
): Result<E, string> => {
    if (typeof value === 'string') {
        return success(value)
    }
    return failure(
        error ?? ({ type: 'value_is_not_a_string' as const, value } as E),
    )
}

/**
 * Checks that value is `undefined`
 */
export const notDefined = <E = { type: 'value_not_undefined'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, undefined> => {
    if (value === undefined) {
        return success(undefined)
    }
    return failure(
        error ?? ({ type: 'value_not_undefined' as const, value } as E),
    )
}

/**
 * Checks that value is matching given input
 */
export const match = <
    // eslint-disable-next-line prettier/prettier
    const T,
    E = {
        type: 'value_is_not_matching_with_reference'
        value: unknown
        matchValue: T
    }
>(
    value: unknown,
    matchValue: T,
    error?: E,
): Result<E, T> => {
    if (value === matchValue) {
        return success(matchValue)
    }

    return failure(
        error ??
        ({
            type: 'value_is_not_matching_with_reference' as const,
            matchValue,
            value,
        } as unknown as E),
    )
}

/**
 * Checks that value is number
 */
export const number = <E = { type: 'value_is_not_a_number'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, number> => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return success(value)
    }
    return failure(
        error ?? ({ type: 'value_is_not_a_number' as const, value } as E),
    )
}

export type StringValueNotNumberError = {
    type: 'string_value_is_not_a_number'
    value: unknown
}

/**
 * Checks that string contains valid number
 */
export const numberString = <E = StringValueNotNumberError>(
    input: unknown,
    error?: E,
): Result<E, number> =>
    string(input, error).andThen((value) => {
        if (!isNaN(Number(value))) {
            return success(Number(value))
        }

        return failure(
            error ??
            ({
                type: 'string_value_is_not_a_number' as const,
                value,
            } as E),
        )
    })

/**
 * Checks that value is a epoch time with milliseconds component
 */
export const timeEpochMs = <
    E =
            | { type: 'value_is_not_a_number'; value: unknown }
        | { type: 'value_is_not_an_epoch_time'; value: number }
>(
    value: unknown,
    error?: E,
): Result<E, Date> =>
    number(value, error).andThen((epochMs) => {
        const date = new Date(epochMs)
        if (isValid(date)) {
            return success(date)
        }

        return failure(
            error ??
            ({
                type: 'value_is_not_an_epoch_time' as const,
                value: epochMs,
            } as E),
        )
    })

export const parseDate = (value: unknown): Result<unknown, Date> => {
    try {
        const date = new Date(value as string | number | Date)
        if (isValid(date)) {
            return success(date)
        }
        return failure({ type: 'cannot_parse_date_from_value', value })
    } catch (e) {
        return failure({ type: 'cannot_parse_date_from_value', value })
    }
}

// // If you need to add new format please make sure it's universal for other APIs.
// const AllowedFormats = {
//     ISO_8601_DATE_FORMAT: DateFormats.ISO_8601_DATE_FORMAT,
//     ISO_8601_DATE_AND_LOCAL_TIME_FORMAT:
//         DateFormats.ISO_8601_DATE_AND_LOCAL_TIME_FORMAT,
//     ISO_8601_DATE_AND_LOCAL_TIME_SHORT_SECOND_FORMAT:
//         DateFormats.ISO_8601_DATE_AND_LOCAL_TIME_SHORT_SECOND_FORMAT,
//     ISO_8601_DATE_AND_LOCAL_TIME_CUT_MS_FORMAT:
//         DateFormats.ISO_8601_DATE_AND_LOCAL_TIME_CUT_MS_FORMAT,
//     PAYMENT_SCHEDULE_SERVER_DATE_FORMAT:
//         DateFormats.PAYMENT_SCHEDULE_SERVER_DATE_FORMAT,
// }
// type DateTransferFormat = ValuesType<typeof AllowedFormats>

// export type DateStringError =
//     | { type: 'value_is_not_a_string'; value: unknown }
//     | {
//           type: 'value_is_not_a_valid_date'
//           value: string
//           format: DateTransferFormat
//       }
//     | {
//           type: 'value_cannot_be_parsed_as_date'
//           value: string
//           format: DateTransferFormat
//       }

/**
 * Checks that value is a valid date
 */
// export const dateString = <E = DateStringError>(
//     value: unknown,
//     format: DateTransferFormat,
//     error?: E
// ): Result<E, Date> => {
//     const parseDate = (stringValue: string) => {
//         try {
//             const dateObj = parse(stringValue, format, new Date())
//             return success(dateObj)
//         } catch {
//             return failure({
//                 type: 'value_cannot_be_parsed_as_date' as const,
//                 value,
//                 format,
//             } as any as E)
//         }
//     }
//
//     const isDateValid = (dateObj: Date) =>
//         isValid(dateObj) // Date might be parsed as "Invalid Date" object
//             ? success(dateObj)
//             : failure({
//                   type: 'value_is_not_a_valid_date' as const,
//                   value,
//                   format,
//               } as any as E)
//
//     return string(value, error)
//         .andThen(parseDate)
//         .andThen(isDateValid)
//         .mapError((err) => error ?? err)
// }

/**
 * Checks that value is `undefined` or `null` and converts it to `null`
 */
export const nullable = <E = { type: 'value_not_null'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, null> => {
    if (value === null || value === undefined) {
        return success(null)
    }
    return failure(
        error ?? ({ type: 'value_not_null' as const, value } as E),
    )
}

export type RequiredError = { type: 'value_is_required'; value: unknown }

/**
 * Checks that value is not `undefined` or `null`
 */
export const required = <T, E = RequiredError>(
    value: T,
    error?: E,
): Result<E, T extends null | undefined ? never : T> => {
    if (value === null || value === undefined) {
        return failure(
            error ?? ({ type: 'value_is_required' as const, value } as E),
        )
    }
    return success(value as any)
}

export type EmptyStringError =
    | { type: 'string_is_empty' }
    | { type: 'value_is_not_a_string'; value: unknown }

/**
 * Checks that value is not an empty string
 */
export const nonEmptyString = (
    value: unknown,
): Result<EmptyStringError, string> => {
    return string(value).andThen((str) => {
        if (!str) return failure({ type: 'string_is_empty' })
        return success(str)
    })
}

export const nonNull = <T>(
    value: T | null,
): Result<{ type: 'value_is_null' }, T> => {
    return value !== null ? success(value) : failure({ type: 'value_is_null' })
}

/**
 * Checks that value is not an empty string
 */

export type EmailStringError =
    | EmptyStringError
    | { type: 'value_is_not_an_email'; value: unknown }

const EMAIL_REGEXP = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i

export const email = (value: unknown): Result<EmailStringError, string> =>
    string(value)
        .andThen(nonEmptyString)
        .andThen((str) =>
            str.match(EMAIL_REGEXP)
                ? success(str)
                : failure({ type: 'value_is_not_an_email', value: str }),
        )

/**
 * Checks that value is `boolean`
 */
export const boolean = <E = { type: 'value_is_not_a_bool'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, boolean> => {
    if (typeof value === 'boolean') {
        return success(value)
    }
    return failure(
        error ?? ({ type: 'value_is_not_a_bool' as const, value } as E),
    )
}

export const arrayBuffer = <E = { type: 'value_is_not_an_array_buffer'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, ArrayBuffer> => {
    if (value instanceof ArrayBuffer && value.byteLength) {
        return success(value)
    }
    return failure(
        error ?? ({ type: 'value_is_not_an_array_buffer' as const, value } as E),
    )
}

export const uint8Array = <E = { type: 'value_is_not_a_uint_8_array'; value: unknown }>(
    value: unknown,
    error?: E,
): Result<E, Uint8Array> => {
    if (value instanceof Uint8Array && value.byteLength) {
        return success(value)
    }
    return failure(
        error ?? ({ type: 'value_is_not_a_uint_8_array' as const, value } as E),
    )
}


export type StringLengthError = {
    type: 'string_length_invalid'
    value: string
    length: number
}

export const stringLength = (
    length: number,
    value: string,
): Result<StringLengthError, string> =>
    value.length !== length
        ? failure({
            type: 'string_length_invalid',
            length,
            value,
        })
        : success(value)

/**
 * Error for value that hasn't min length required
 */
export type MinStringLengthError = {
    type: 'min_string_length_is_not_reached'
    value: string
    min: number
}
/**
 * Checks that string value has min length required
 */
export const minStringLength = (
    min: number,
    value: string,
): Result<MinStringLengthError, string> =>
    value.length < min
        ? failure({
            type: 'min_string_length_is_not_reached',
            min,
            value,
        })
        : success(value)

/**
 * Error for value that hasn't max length required
 */
export type MaxStringLengthError = {
    type: 'max_string_length_is_exceeded'
    value: string
    max: number
}
/**
 * Checks that string value has max length required
 */
export const maxStringLength = (
    max: number,
    value: string,
): Result<MaxStringLengthError, string> =>
    value.length > max
        ? failure({
            type: 'max_string_length_is_exceeded',
            max,
            value,
        })
        : success(value)

/**
 * Error for array that hasn't min length required
 */
export type MinArrayLengthError<T> = {
    type: 'min_array_length_is_not_reached'
    value: Array<T>
    min: number
}
/**
 * Checks that array value has min length required
 */
export const minArrayLength = <T>(
    min: number,
    value: Array<T>,
): Result<MinArrayLengthError<T>, Array<T>> =>
    value.length < min
        ? failure({
            type: 'min_array_length_is_not_reached',
            min,
            value,
        })
        : success(value)

export type NonEmptyArrayError = { type: 'array_is_empty' }


export type ValueIsNotAHttpsURL = {
    type: 'value_is_not_a_https_url'
    value: string
}

const httpsRegexp = new RegExp('^https://', "i")

export const parseHttpsUrl = (
    value: string,
): Result<ValueIsNotAHttpsURL, string> =>
    value.match(httpsRegexp)
        ? success(value)
        : failure({
            type: 'value_is_not_a_https_url' as const,
            value: value,
        })


export type ValueIsNotHttpOrHttpsURL = {
    type: 'value_is_not_http_or_https_url'
    value: string
}

const httpOrHttpsRegexp = new RegExp('^https?://', "i")

export const parseHttpOrHttpsUrl = (
    value: string,
): Result<ValueIsNotHttpOrHttpsURL, string> =>
    value.match(httpOrHttpsRegexp)
        ? success(value)
        : failure({
            type: 'value_is_not_http_or_https_url' as const,
            value: value,
        })

export const nonEmptyArray = <T>(
    value: Array<T>,
): Result<NonEmptyArrayError, NonEmptyArray<T>> => {
    if (isNonEmptyArray(value)) {
        return success(value)
    }
    return failure({ type: 'array_is_empty' })
}

export type MinAmountError = {
    type: 'min_amount_is_not_reached'
    value: number
    min: number
}

/**
 * Checks that amount is not less than required
 */
export const minAmount = (
    min: number,
    value: number,
): Result<MinAmountError, number> => {
    if (value >= min) {
        return success(value)
    }

    return failure({ type: 'min_amount_is_not_reached', min, value })
}

export type MaxAmountError = {
    type: 'max_amount_is_reached'
    value: number
    max: number
}

/**
 * Checks that amount is not more than required
 */
export const maxAmount = (
    max: number,
    value: number,
): Result<MaxAmountError, number> => {
    if (value <= max) {
        return success(value)
    }

    return failure({ type: 'max_amount_is_reached', max, value })
}

export const bigint = (input: unknown): Result<unknown, bigint> => {
    try {
        return success(BigInt(input as string | number | bigint | boolean))
    } catch (e) {
        return failure({ type: 'cannot_parse_bigint', value: input })
    }
}
