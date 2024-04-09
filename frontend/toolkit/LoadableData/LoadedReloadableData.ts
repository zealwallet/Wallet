import * as Primitive from './Primitive'

/**
 * Type representing async process which starts initialized with result and this, can be restarted on demand and require parameters to execute
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type LoadedReloadableData<T, P, E = unknown> =
    | Primitive.Loaded<T, P>
    | Primitive.Reloading<T, P>
    | Primitive.SubsequentFailed<T, P, E>
