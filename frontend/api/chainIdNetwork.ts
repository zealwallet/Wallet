import axios from 'axios'

import { convertToHttpErrorToPreserverStack } from './interceptors'

const request = axios.create({
    baseURL: 'https://chainid.network/',
})

request.interceptors.response.use(
    (response) => response,
    convertToHttpErrorToPreserverStack
)

export const get = (path: string, signal?: AbortSignal): Promise<unknown> =>
    request
        .get(path, {
            signal,
            withCredentials: false,
        })
        .then((r) => r.data)
