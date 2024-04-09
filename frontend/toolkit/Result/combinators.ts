import { failure, isSuccess, Result, success } from './Result'
import { array, nullable, ValidObject } from './validators'

import { notReachable } from '../notReachable'
import { keys } from '../Object'

/**
 * Converts array of Result into Result with Errors for failure and Types for success
 * When at least 1 failure => Failure
 *
 * @params results - A non empty array of results
 * @returns Result with all failures or success with all data
 */

export const combine = <E, T>(results: Result<E, T>[]): Result<E[], T[]> => {
    const failureReasons: E[] = []
    const successData: T[] = []
    results.forEach((result) => {
        switch (result.type) {
            case 'Failure':
                failureReasons.push(result.reason)
                break
            case 'Success':
                successData.push(result.data)
                break
            default:
                /* istanbul ignore next */
                notReachable(result)
        }
    })
    return failureReasons.length
        ? failure(failureReasons)
        : success(successData)
}

/**
 * Tries to find result of type `Success` within given array of results.
 *
 * @param results - A non empty array of results to try searching one of type `Success` within.
 * @returns Either first found `Success` or first found `Failure` (in case of there is no `Success` found).
 */

type OneOfError = { type: 'none_of_results_are_successful'; value: unknown }

export const nullableOf = <T>(
    input: unknown,
    parser: (input: unknown) => Result<unknown, T>
): Result<unknown, T | null> => oneOf(input, [parser(input), nullable(input)])

// 2 params
export function oneOf<T0, T1, E0, E1>(
    value: unknown,
    arr: [Result<E0, T0>, Result<E1, T1>]
): Result<OneOfError, T0 | T1>

// 3 params
export function oneOf<T0, T1, T2, E0, E1, E2>(
    value: unknown,
    arr: [Result<E0, T0>, Result<E1, T1>, Result<E2, T2>]
): Result<OneOfError, T0 | T1 | T2>

// 4 params
export function oneOf<T0, T1, T2, T3, E0, E1, E2, E3>(
    value: unknown,
    arr: [Result<E0, T0>, Result<E1, T1>, Result<E2, T2>, Result<E3, T3>]
): Result<OneOfError, T0 | T1 | T2 | T3>

// 5 params
export function oneOf<T0, T1, T2, T3, T4, E0, E1, E2, E3, E4>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4>

// 6 params
export function oneOf<T0, T1, T2, T3, T4, T5, E0, E1, E2, E3, E4, E5>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>,
        Result<E5, T5>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4 | T5>

// 7 params
export function oneOf<T0, T1, T2, T3, T4, T5, T6, E0, E1, E2, E3, E4, E5, E6>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>,
        Result<E5, T5>,
        Result<E6, T6>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4 | T5 | T6>

// 8 params
export function oneOf<
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    E0,
    E1,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7
>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>,
        Result<E5, T5>,
        Result<E6, T6>,
        Result<E7, T7>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7>

// 9 params
export function oneOf<
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    E0,
    E1,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8
>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>,
        Result<E5, T5>,
        Result<E6, T6>,
        Result<E7, T7>,
        Result<E8, T8>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>

// 10 params
export function oneOf<
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    E0,
    E1,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9
>(
    value: unknown,
    arr: [
        Result<E0, T0>,
        Result<E1, T1>,
        Result<E2, T2>,
        Result<E3, T3>,
        Result<E4, T4>,
        Result<E5, T5>,
        Result<E6, T6>,
        Result<E7, T7>,
        Result<E8, T8>,
        Result<E9, T9>
    ]
): Result<OneOfError, T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>

export function oneOf<T0, E0>(
    value: unknown,
    results: Result<E0, T0>[]
): Result<OneOfError, T0> {
    const foundSuccess = results.find(isSuccess)
    if (foundSuccess) {
        return foundSuccess
    }

    return failure({ type: 'none_of_results_are_successful', value })
}

type Ext<T extends { [key: string]: Result<any, any> }> = Result<
    {
        [K in keyof T]?: T[K] extends Result<infer Err, any> ? Err : never
    },
    {
        [K in keyof T]: T[K] extends Result<any, infer R> ? R : never
    }
>

export const shape = <Conf extends { [key: string]: Result<any, any> }>(
    config: Conf
): Ext<Conf> => {
    const error = {} as any
    const out = {} as any
    keys(config).forEach((key) => {
        const typedKey = key
        const result = config[typedKey]
        switch (result.type) {
            case 'Failure':
                error[typedKey] = result.reason
                break
            case 'Success':
                out[typedKey] = result.data
                break
            default:
                notReachable(result)
        }
    })

    if (keys(error).length === 0) {
        return success(out)
    }
    return failure(error)
}

export const groupByType = <E, T>(results: Result<E, T>[]): [E[], T[]] => {
    return results.reduce(
        ([errorReasons, successData], item) => {
            switch (item.type) {
                case 'Failure':
                    errorReasons.push(item.reason)
                    break
                case 'Success':
                    successData.push(item.data)
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(item)
            }
            return [errorReasons, successData]
        },
        [[], []] as [E[], T[]]
    )
}

/**
 * @deprecated Use recordStrict instead
 */
export const record = <T>(
    input: Record<string, unknown>,
    parser: (input: unknown) => Result<unknown, T>
): Result<unknown, Record<string, T>> => {
    const ks = keys(input)
    const [errors, parsed] = groupByType(ks.map((k) => parser(input[k])))
    if (errors.length) {
        return failure(errors)
    }
    const result = ks.reduce((r, currentKey, currentIndex) => {
        r[currentKey] = parsed[currentIndex]
        return r
    }, {} as Record<string, T>)

    return success(result)
}

export const recordStrict = <T, K extends string>(
    input: Record<string, unknown>,
    {
        keyParser,
        valueParser,
    }: {
        valueParser: (input: unknown) => Result<unknown, T>
        keyParser: (input: string) => Result<unknown, K>
    }
): Result<unknown, Record<K, T>> => {
    const originalKeys = keys(input)
    const [errorsKeys, parsedKeys] = groupByType(originalKeys.map(keyParser))
    if (errorsKeys.length) {
        return failure(errorsKeys)
    }

    const [errors, parsed] = groupByType(
        originalKeys.map((k) => {
            return valueParser(input[k])
        })
    )
    if (errors.length) {
        return failure(errors)
    }
    const result = parsedKeys.reduce((r, currentKey, currentIndex) => {
        r[currentKey] = parsed[currentIndex]
        return r
    }, {} as Record<K, T>)

    return success(result)
}

export const merge = <T1 extends ValidObject, E1, T2 extends ValidObject, E2>(
    ...items: [Result<E1, T1>, Result<E2, T2>]
): Result<(E1 | E2)[], T1 & T2> => {
    return combine(items as Result<E1 | E2, T1 & T2>[]).map((successItems) => {
        return successItems.reduce((current, item) => {
            return {
                ...current,
                ...item,
            }
        }, {} as any)
    })
}

export const safeArrayOf = <E1, T>(
    value: unknown,
    parser: (item: unknown) => Result<E1, T>
): Result<unknown, T[]> =>
    array(value)
        .map((arr) => arr.map((item) => parser(item)))
        .map((items) => {
            const [, arr] = groupByType(items)
            return arr
        })

export const arrayOf = <E1, T>(
    value: unknown,
    parser: (item: unknown) => Result<E1, T>
): Result<unknown, T[]> =>
    array(value)
        .map((arr) => arr.map((item) => parser(item)))
        .andThen((items) => combine(items))
