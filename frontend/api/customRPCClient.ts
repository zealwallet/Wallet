import axios from 'axios'

import { convertToHttpErrorToPreserverStack } from './interceptors'

export const request = axios.create()

request.interceptors.response.use(
    (response) => response,
    convertToHttpErrorToPreserverStack
)

export const post = (
    path: string,
    body: object,
    signal?: AbortSignal
): Promise<unknown> =>
    request
        .post(path, body, {
            signal,
            headers: {
                'content-type': 'application/json',
            },
        })
        .then(({ data }) => data)

export const get = (
    path: string,
    params: Record<string, string | number | boolean>,
    signal?: AbortSignal
): Promise<unknown> =>
    request.get(path, { params, signal }).then(({ data }) => data)
