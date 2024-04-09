import { notReachable } from '../notReachable'

interface InstanceMethods {
    andThen<E, T, T1>(
        this: Result<E, T>,
        cb: (arg: T) => Result<E, T1>
    ): Result<E, T1>

    map<E, T, T1>(this: Result<E, T>, cb: (arg: T) => T1): Result<E, T1>

    mapError<E, E1, T>(this: Result<E, T>, cb: (arg: E) => E1): Result<E1, T>

    getFailureReason<E, T>(this: Result<E, T>): E | undefined
}

export class UnexpectedResultFailureError<E> extends Error {
    isUnexpectedResultFailureError = true
    name = 'UnexpectedResultFailureError'

    readonly reason: E

    constructor(message: string, reason: E) {
        super(message)

        this.reason = reason
    }
}

class Failure<E> implements InstanceMethods {
    readonly type = 'Failure'

    readonly reason: E

    constructor(reason: E) {
        this.reason = reason
    }

    andThen<E, E1, T, T1>(
        this: Result<E, T>,
        cb: (arg: T) => Result<E1, T1>
    ): Result<E | E1, T1> {
        return then(this, cb)
    }

    getFailureReason<E, T>(this: Result<E, T>): E | undefined {
        return getFailureReason(this)
    }

    getSuccessResult<E, T>(this: Result<E, T>): T | undefined {
        return getSuccessResult(this)
    }

    getSuccessResultOrThrow<E, T>(this: Result<E, T>, message: string): T {
        return getSuccessResultOrThrow(this, message)
    }

    map<E, T, T1>(this: Result<E, T>, cb: (arg: T) => T1): Result<E, T1> {
        return map(this, cb)
    }

    mapError<E, E1, T>(this: Result<E, T>, cb: (arg: E) => E1): Result<E1, T> {
        return mapError(this, cb)
    }

    mapErrorEntityInfo<E, T, K>(
        this: Result<E, T>,
        info: K
    ): Result<{ entityInfo: K; reason: E }, T> {
        return mapErrorEntityInfo(this, info)
    }
}

class Success<T> implements InstanceMethods {
    readonly type = 'Success'

    readonly data: T

    constructor(data: T) {
        this.data = data
    }

    andThen<E, E1, T, T1>(
        this: Result<E, T>,
        cb: (arg: T) => Result<E1, T1>
    ): Result<E | E1, T1> {
        return then(this, cb)
    }

    map<E, T, T1>(this: Result<E, T>, cb: (arg: T) => T1): Result<E, T1> {
        return map(this, cb)
    }

    mapError<E, E1, T>(this: Result<E, T>, cb: (arg: E) => E1): Result<E1, T> {
        return mapError(this, cb)
    }

    mapErrorEntityInfo<E, T, K>(
        this: Result<E, T>,
        info: K
    ): Result<{ entityInfo: K; reason: E }, T> {
        return mapErrorEntityInfo(this, info)
    }

    getFailureReason<E, T>(this: Result<E, T>): E | undefined {
        return getFailureReason(this)
    }

    getSuccessResult<E, T>(this: Result<E, T>): T | undefined {
        return getSuccessResult(this)
    }

    getSuccessResultOrThrow<E, T>(this: Result<E, T>, message: string): T {
        return getSuccessResultOrThrow(this, message)
    }
}

const getSuccessResultOrThrow = <E, T>(
    result: Result<E, T>,
    message: string
): T => {
    switch (result.type) {
        case 'Failure':
            throw new UnexpectedResultFailureError(message, result.reason)

        case 'Success':
            return result.data
        default:
            /* istanbul ignore next */
            return notReachable(result)
    }
}

const map = <E, T, T1>(
    result: Result<E, T>,
    cb: (result: T) => T1
): Result<E, T1> => {
    switch (result.type) {
        case 'Failure':
            return result
        case 'Success':
            return success(cb(result.data))
        default:
            return notReachable(result)
    }
}

const mapError = <E, E1, T>(
    result: Result<E, T>,
    cb: (error: E) => E1
): Result<E1, T> => {
    switch (result.type) {
        case 'Failure':
            return failure(cb(result.reason))
        case 'Success':
            return result

        /* istanbul ignore next */
        default:
            return notReachable(result)
    }
}

const mapErrorEntityInfo = <E, T, K>(
    result: Result<E, T>,
    entityInfo: K
): Result<{ entityInfo: K; reason: E }, T> => {
    switch (result.type) {
        case 'Failure':
            return failure({ entityInfo, reason: result.reason })
        case 'Success':
            return result

        /* istanbul ignore next */
        default:
            return notReachable(result)
    }
}

const then = <E, E1, T, T1>(
    result: Result<E, T>,
    cb: (result: T) => Result<E1, T1>
): Result<E | E1, T1> => {
    switch (result.type) {
        case 'Failure':
            return result
        case 'Success':
            return cb(result.data)
        default:
            return notReachable(result)
    }
}

const getSuccessResult = <E, T>(result: Result<E, T>): T | undefined => {
    switch (result.type) {
        case 'Failure':
            return undefined
        case 'Success':
            return result.data

        /* istanbul ignore next */
        default:
            return notReachable(result)
    }
}

const getFailureReason = <E, T>(result: Result<E, T>): E | undefined => {
    switch (result.type) {
        case 'Failure':
            return result.reason
        case 'Success':
            return undefined

        /* istanbul ignore next */
        default:
            return notReachable(result)
    }
}

export type Result<E, T> = Failure<E> | Success<T>

export const isFailure = <E, T>(result: Result<E, T>): result is Failure<E> =>
    result.type === 'Failure'

export const isSuccess = <E, T>(result: Result<E, T>): result is Success<T> =>
    result.type === 'Success'

// Constructors

export const failure = <E>(reason: E): Result<E, never> => {
    return new Failure<E>(reason)
}

export const success = <T>(data: T): Result<never, T> => {
    return new Success<T>(data)
}
