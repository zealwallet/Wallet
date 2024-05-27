import { joinURL } from '@zeal/toolkit/URL/joinURL'

import { HttpError } from '@zeal/domains/Error'

import { Auth, getAuthHeaders } from './Auth'

const GNOSIS_PAY_BASE_URL = 'https://api.gnosispay.com/api/v1'

type Paths = {
    get: {
        '/me': { query: undefined }
        '/auth/nonce': { query: undefined }
        '/transactions': { query: undefined }
        '/account-balances': { query: undefined }
    } & Record<
        `/cards/${string}/details`,
        { query: { encryptedKey: string } }
    > &
        Record<`/cards/${string}/pin`, { query: { encryptedKey: string } }>

    post: {
        '/auth/verify': {
            query: undefined
            body: { message: string; signature: string }
        }
    }
}

export const get = <T extends keyof Paths['get']>(
    path: T,
    params: { query?: Paths['get'][T]['query']; auth?: Auth }, // TODO @resetko-zeal fix query is not mandatory even if its there in Paths
    signal?: AbortSignal
): Promise<unknown> => {
    const url = joinURL(GNOSIS_PAY_BASE_URL, path)
    const query = params.query
        ? `?${new URLSearchParams(params.query as Record<string, string>)}`
        : ''
    const urlWithQuery = `${url}${query}`

    return fetch(urlWithQuery, {
        method: 'GET',
        headers: {
            ...(params.auth ? getAuthHeaders(params.auth) : {}),
        },
        signal,
    }).then(async (response) => {
        if (response.ok) {
            return response.text()
        }
        const status = response.status
        const trace = response.headers.get('trace-id') || null
        const data = await response.text().catch(() => null)

        throw new HttpError(url, 'GET', status, trace, data, params)
    })
}

export const post = <T extends keyof Paths['post']>(
    path: T,
    params: {
        query?: Paths['post'][T]['query']
        body: Paths['post'][T]['body']
    },
    signal?: AbortSignal
): Promise<unknown> => {
    const url = joinURL(GNOSIS_PAY_BASE_URL, path)
    const query = params.query
        ? `?${new URLSearchParams(params.query as Record<string, string>)}`
        : ''
    const urlWithQuery = `${url}${query}`

    return fetch(urlWithQuery, {
        method: 'POST',
        body: JSON.stringify(params.body),
        headers: {
            'Content-Type': 'application/json',
        },
        signal,
    }).then(async (response) => {
        if (response.ok) {
            return response.text()
        }
        const status = response.status
        const trace = response.headers.get('trace-id') || null
        const data = await response.text().catch(() => null)

        throw new HttpError(url, 'POST', status, trace, data, params)
    })
}
