import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import * as Primitive from './Primitive'

import { noop } from '../noop'
import { notReachable } from '../notReachable'
import { useLiveRef } from '../useLiveRef'

/**
 * Type representing  async process which starts immedately, can be restarted on demand and require parameters to execute
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type ReloadableData<T, P, E = unknown> =
    | Primitive.Loaded<T, P>
    | Primitive.Reloading<T, P>
    | Primitive.SubsequentFailed<T, P, E>
    | Primitive.Loading<P>
    | Primitive.Failed<P, E>

/**
 * Hook to simplify usage of {@link ReloadableData} type in React
 * @param fetch function which requires params P and returns Promise<T>, representing async action
 * @param initState initial state of the loadable data
 * @param options.accumulate  function allows to accumulate data when you transition from reloading to loaded state
 *                useful when do
 */
export const useReloadableData = <T, P, E = unknown>(
    fetch: (params: P & { signal?: AbortSignal }) => Promise<T>,
    initState: ReloadableData<T, P, E> | (() => ReloadableData<T, P, E>),
    options?: {
        accumulate: (newData: T, prevData: T) => T
    }
): [
    ReloadableData<T, P, E>,
    Dispatch<SetStateAction<ReloadableData<T, P, E>>>
] => {
    const fetchRef = useLiveRef(fetch)
    const [state, setState] = useState<ReloadableData<T, P, E>>(initState)

    const mergeState =
        options?.accumulate ?? ((currentData: T): T => currentData)

    const mergeStateLive = useLiveRef(mergeState)

    useEffect(() => {
        const loadData = (params: P, onError: (e: E) => void) => {
            const controller = new AbortController()
            const stateParams = {
                ...params,
                signal: controller.signal,
            }
            fetchRef
                .current(stateParams)
                .then((data) => {
                    if (stateParams.signal.aborted) {
                        return
                    }

                    switch (state.type) {
                        case 'loading':
                        case 'error':
                        case 'loaded':
                        case 'subsequent_failed':
                            setState({
                                type: 'loaded',
                                params,
                                data,
                            })
                            return
                        case 'reloading': {
                            const newData = mergeStateLive.current(
                                data,
                                state.data
                            )
                            setState({
                                type: 'loaded',
                                params,
                                data: newData,
                            })
                            return
                        }

                        default:
                            /* istanbul ignore next */
                            return notReachable(state)
                    }
                })
                .catch((e) => {
                    if (stateParams.signal.aborted) {
                        return
                    }
                    onError(e)
                })

            return () => controller.abort()
        }
        switch (state.type) {
            case 'loading': {
                const params = state.params
                return loadData(params, (error) => {
                    setState({
                        type: 'error',
                        error,
                        params,
                    })
                })
            }

            case 'reloading': {
                const params = state.params
                return loadData(params, (error) => {
                    setState({
                        type: 'subsequent_failed',
                        error,
                        params,
                        data: state.data,
                    })
                })
            }
            case 'error':
            case 'subsequent_failed':
            case 'loaded':
                return noop

            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [fetchRef, mergeStateLive, state])

    return [state, setState]
}
