import axios from 'axios'

import { isProduction } from '@zeal/toolkit/Environment/isProduction'
import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { HttpError } from '@zeal/domains/Error'

import { Auth, getAuthHeaders } from './Auth'
import { convertToHttpErrorToPreserverStack } from './interceptors'
import { components, paths } from './portfolio'

/**
 * TODO fix OpenAPI generation so it will generate
 * `/wallet/rate/default/${components['schemas']['Network']}/${string}/`
 * instead of
 * `/wallet/rate/default/${network}/${string}/`
 * if it's possible
 *
 * As well in query parameters it's currently impossible to generate template types
 * And some unblock URLs are broken because of that
 */
export type APIPaths = Omit<
    paths,
    '/wallet/unblock/' | '/wallet/rate/default/{network}/{tokenAddress}/'
> & {
    '/wallet/unblock/': Omit<paths['/wallet/unblock/'], 'get'> & {
        get: Omit<paths['/wallet/unblock/']['get'], 'parameters'> & {
            parameters: Omit<
                paths['/wallet/unblock/']['get']['parameters'],
                'query'
            > & {
                query: Omit<
                    paths['/wallet/unblock/']['get']['parameters']['query'],
                    'path'
                > & {
                    path:
                        | components['schemas']['UnblockPath']
                        | `/user/bank-account/remote/${string}`
                        | `/fees${string}`
                        | `/exchange-rates/${string}`
                }
            }
        }
    }
    [
        key: `/wallet/rate/default/${components['schemas']['Network']}/${string}/`
    ]: paths['/wallet/rate/default/{network}/{tokenAddress}/']
}

const BASE_URL = isProduction()
    ? 'https://rdwdvjp8j5.execute-api.eu-west-1.amazonaws.com/'
    : 'https://iw8i6d52oi.execute-api.eu-west-2.amazonaws.com/'

export const request = axios.create({
    baseURL: BASE_URL,
})

request.interceptors.response.use(
    (response) => response,
    convertToHttpErrorToPreserverStack
)

type OpResponseTypes<OP> = OP extends {
    responses: infer R
}
    ? {
          [S in keyof R]: R[S] extends { schema?: infer S } // openapi 2
              ? S
              : R[S] extends { content: { 'application/json': infer C } } // openapi 3
              ? C
              : S extends 'default'
              ? R[S]
              : unknown
      }
    : never

type _OpReturnType<T> = 200 extends keyof T
    ? T[200]
    : 201 extends keyof T
    ? T[201]
    : 'default' extends keyof T
    ? T['default']
    : unknown

type OpReturnType<OP> = _OpReturnType<OpResponseTypes<OP>>

type OpArgType<OP> = (OP extends {
    requestBody: { content: { 'application/json': infer RB } }
}
    ? { body: RB }
    : { body?: unknown }) &
    (OP extends { parameters?: { body?: infer B } }
        ? { body: B }
        : { body?: unknown }) &
    (OP extends { parameters?: { query: infer Q } }
        ? { query: Q }
        : { query?: unknown })

type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

export const post = <Key extends KeysMatching<APIPaths, { post: unknown }>>(
    path: Key,
    params: OpArgType<APIPaths[Key]['post']> & {
        auth?: Auth
        requestSource?: string
    },
    signal?: AbortSignal
): Promise<OpReturnType<APIPaths[Key]['post']>> =>
    request
        .post(path, params.body, {
            params: params.query,
            signal,
            withCredentials: false,
            headers: {
                ...(params.auth ? getAuthHeaders(params.auth) : {}),
                ...(params.requestSource
                    ? { 'x-requested-for': params.requestSource }
                    : {}),
            },
        })
        .then((r) => r.data)

export const patch = <Key extends KeysMatching<APIPaths, { patch: unknown }>>(
    path: Key,
    params: OpArgType<APIPaths[Key]['patch']> & { auth?: Auth },
    signal?: AbortSignal
): Promise<OpReturnType<APIPaths[Key]['patch']>> =>
    request
        .patch(path, params.body, {
            params: params.query,
            signal,
            withCredentials: false,
            headers: {
                ...(params.auth ? getAuthHeaders(params.auth) : {}),
            },
        })
        .then((r) => r.data)

export const get = <Key extends KeysMatching<APIPaths, { get: unknown }>>(
    path: Key,
    params: OpArgType<APIPaths[Key]['get']> & { auth?: Auth },
    signal?: AbortSignal
): Promise<OpReturnType<APIPaths[Key]['get']>> => {
    const url = joinURL(BASE_URL, path)
    const query = params.query
        ? `?${new URLSearchParams(params.query as Record<string, string>)}`
        : ''
    const urlWithQuery = `${url}${query}`

    return fetch(urlWithQuery, {
        credentials: 'omit',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip',
            'Cache-Control': 'max-age=0', // cache not working on ios without cache control header
            ...(params.auth ? getAuthHeaders(params.auth) : {}),
        },
        signal,
    }).then(async (response) => {
        if (response.ok) {
            return response.json()
        }
        const status = response.status
        const trace = response.headers.get('trace-id') || null
        const data = await response.json().catch(() => null)

        throw new HttpError(url, 'GET', status, trace, data, params)
    })
}

export const put = <Key extends KeysMatching<APIPaths, { put: unknown }>>(
    path: Key,
    params: OpArgType<APIPaths[Key]['put']> & { auth?: Auth },
    signal?: AbortSignal
): Promise<OpReturnType<APIPaths[Key]['put']>> =>
    request
        .put(path, params.body, {
            params: params.query,
            signal,
            withCredentials: false,
            headers: {
                ...(params.auth ? getAuthHeaders(params.auth) : {}),
            },
        })
        .then((r) => r.data)
