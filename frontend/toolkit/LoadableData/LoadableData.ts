import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import * as Primitive from './Primitive'

import { noop } from '../noop'
import { useLiveRef } from '../useLiveRef'

/**
 * Type representing async process which starts immediately and require parameters to start
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type LoadableData<T, P, E = unknown> =
    | Primitive.Loading<P>
    | Primitive.Loaded<T, P>
    | Primitive.Failed<P, E>

/**
 * Hook to simplify usage of {@link LoadableData} type in React
 * @param fetch function which requires params P and returns Promise<T>, representing async action
 */
export const useLoadableData = <T, P, E = unknown>(
    fetch: (params: P & { signal: AbortSignal }) => Promise<T>,
    initialState: LoadableData<T, P, E>
): [LoadableData<T, P, E>, Dispatch<SetStateAction<LoadableData<T, P, E>>>] => {
    const fetchRef = useLiveRef(fetch)
    const [state, setState] = useState<LoadableData<T, P, E>>(initialState)

    useEffect(() => {
        if (state.type === 'loading') {
            const controller = new AbortController()
            const stateParams = {
                ...state.params,
                signal: controller.signal,
            }

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
