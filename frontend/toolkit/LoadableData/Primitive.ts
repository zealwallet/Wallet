export type Loading<P> = { type: 'loading'; params: P }

export type Reloading<T, P> = {
    type: 'reloading'
    data: T
    params: P
}

export type Loaded<T, P> = { type: 'loaded'; data: T; params: P }

export type Failed<P, E = unknown> = {
    type: 'error'
    error: E
    params: P
}

export type SubsequentFailed<T, P, E = unknown> = {
    type: 'subsequent_failed'
    error: E
    data: T
    params: P
}

export type NotAsked = { type: 'not_asked'; params?: never }
