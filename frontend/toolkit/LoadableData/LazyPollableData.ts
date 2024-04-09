import { Dispatch, SetStateAction, useEffect } from 'react'

import { LazyReloadableData, useLazyReloadableData } from './LazyReloadableData'

import { noop } from '../noop'
import { notReachable } from '../notReachable'
import { useLiveRef } from '../useLiveRef'

/**
 * Type representing repeating async process which starts immedately and require parameters to execute
 * @typeParam T Type of result
 * @typeParam P Type of parameters
 * @typeParam E Type of error which can happen during async process
 */
export type LazyPollableData<T, P, E = unknown> = LazyReloadableData<T, P, E>

type Config<T, P, E> = {
    stopIf?: (loadable: LazyPollableData<T, P, E>) => boolean
    pollIntervalMilliseconds: number
}

const timeout = (cb: () => void, intervalMs: number) => {
    const id = setTimeout(cb, intervalMs)
    return () => clearTimeout(id)
}

/**
 * Hook to simplify usage of {@link LazyPollableData} type in React
 * @param fetch function which requires params P and returns Promise<T>, representing async action
 * @param config.pollIntervalMilliseconds interval in milliseconds to execute async process
 * @param config.stopIf function which accepts current state and return true if polling should stop
 */
export const useLazyPollableData = <T, P, E = unknown>(
    fetch: (params: P & { signal?: AbortSignal }) => Promise<T>,
    initState: LazyPollableData<T, P, E>,
    { pollIntervalMilliseconds, stopIf = () => false }: Config<T, P, E>
): [
    LazyPollableData<T, P, E>,
    Dispatch<SetStateAction<LazyPollableData<T, P, E>>>
] => {
    const [state, setState] = useLazyReloadableData(fetch, initState)

    const stopIfRef = useLiveRef(stopIf)

    useEffect(() => {
        switch (state.type) {
            case 'not_asked':
            case 'loading':
            case 'reloading':
                return noop
            case 'error':
                return stopIfRef.current(state)
                    ? noop
                    : timeout(() => {
                          setState({ type: 'loading', params: state.params })
                      }, pollIntervalMilliseconds)
            case 'loaded':
            case 'subsequent_failed':
                return stopIfRef.current(state)
                    ? noop
                    : timeout(() => {
                          setState({
                              type: 'reloading',
                              params: state.params,
                              data: state.data,
                          })
                      }, pollIntervalMilliseconds)
            default:
                return notReachable(state)
        }
    }, [state, pollIntervalMilliseconds, stopIfRef, setState])

    return [state, setState]
}
