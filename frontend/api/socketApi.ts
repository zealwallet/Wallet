import axios from 'axios'

import { convertToHttpErrorToPreserverStack } from './interceptors'

const API_KEY = '1d7bfc31-6018-4876-b7c2-980ce0e903de'

export const request = axios.create({
    baseURL: 'https://api.socket.tech/v2',
    headers: {
        'api-key': API_KEY,
    },
})

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
        .then((response) => {
            const data = response.data
            if (data.success) {
                return data.result
            }

            throw response.data
        })

export const get = (
    path: string,
    params: Record<string, string | number | boolean | string[]>,
    signal?: AbortSignal
): Promise<unknown> =>
    request.get(path, { params, signal }).then((response) => {
        const data = response.data
        if (data.success) {
            return data.result
        }

        throw response.data
    })
