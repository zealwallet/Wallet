import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import * as Primitive from './Primitive'
import { ReloadableData } from './ReloadableData'

import { noop } from '../noop'
import { notReachable } from '../notReachable'
import { useLiveRef } from '../useLiveRef'

/**
 * Type representing  async process which starts on demand, can be restarted on demand and require parameters to execute
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type LazyReloadableData<T, P, E = unknown> =
    | ReloadableData<T, P, E>
    | Primitive.NotAsked

export const useLazyReloadableData = <T, P, E = unknown>(
    fetch: (params: P & { signal?: AbortSignal }) => Promise<T>,
    initState:
        | LazyReloadableData<T, P, E>
        | (() => LazyReloadableData<T, P, E>),
    options?: {
        accumulate: (newData: T, prevData: T) => T
    }
): [
    LazyReloadableData<T, P, E>,
    Dispatch<SetStateAction<LazyReloadableData<T, P, E>>>
] => {
    const fetchRef = useLiveRef(fetch)
    const [state, setState] = useState<LazyReloadableData<T, P, E>>(initState)

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
                        case 'not_asked':
                        case 'loading':
                        case 'error':
                        case 'loaded':
                        case 'subsequent_failed':
                            setState({
                                type: 'loaded',
                                params,
                                data,
                            })
                            break
                        case 'reloading': {
                            const newData = mergeStateLive.current(
                                data,
                                state.data
                            )
                            return setState({
                                type: 'loaded',
                                params,
                                data: newData,
                            })
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
                return loadData(
                    params,

                    (error) => {
                        setState({
                            type: 'subsequent_failed',
                            error,
                            params,
                            data: state.data,
                        })
                    }
                )
            }
            case 'not_asked':
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
