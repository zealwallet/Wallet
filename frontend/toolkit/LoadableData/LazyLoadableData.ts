import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { LoadableData } from './LoadableData'
import * as Primitive from './Primitive'

import { noop } from '../noop'
import { useLiveRef } from '../useLiveRef'

/**
 * Type representing async process which starts on demand and require parameters to start
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type LazyLoadableData<T, P, E = unknown> =
    | Primitive.NotAsked
    | LoadableData<T, P, E>

/**
 * Hook to simplify usage of {@link LazyLoadableData} type in React
 * @param fetch function which requires params P and returns Promise<T>, representing async action
 */
export const useLazyLoadableData = <T, P, E = unknown>(
    fetch: (params: P & { signal?: AbortSignal }) => Promise<T>,
    initialState: LazyLoadableData<T, P, E> = { type: 'not_asked' }
): [
    LazyLoadableData<T, P, E>,
    Dispatch<SetStateAction<LazyLoadableData<T, P, E>>>
] => {
    const fetchRef = useLiveRef(fetch)
    const [state, setState] = useState<LazyLoadableData<T, P, E>>(initialState)

    useEffect(() => {
        if (state.type === 'loading') {
            const controller = new AbortController()
            const stateParams = { ...state.params, signal: controller.signal }

            fetchRef
                .current(stateParams)
                .then((data) => {
                    if (stateParams.signal.aborted) {
                        return
                    }
                    setState({ type: 'loaded', data, params: stateParams })
                })
                .catch((error) => {
                    if (stateParams.signal.aborted) {
                        return
                    }
                    setState({ type: 'error', error, params: stateParams })
                })

            return () => controller.abort()
        }

        return noop
    }, [fetchRef, state.type, state.params])

    return [state, setState]
}
