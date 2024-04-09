import axios from 'axios'

import { convertToHttpErrorToPreserverStack } from './interceptors'

const request = axios.create({
    baseURL: 'https://www.googleapis.com/drive/v3/',
})

const requestUpload = axios.create({
    baseURL: 'https://www.googleapis.com/upload/drive/v3/',
})

request.interceptors.response.use(
    (response) => response,
    convertToHttpErrorToPreserverStack
)

requestUpload.interceptors.response.use(
    (response) => response,
    convertToHttpErrorToPreserverStack
)

export const post = (
    path: string,
    params: {
        body?: any
        query?: any
        headers?: any
    },
    token: string,
    signal?: AbortSignal
): Promise<unknown> =>
    request
        .post(path, params.body, {
            params: params.query,
            headers: {
                Authorization: 'Bearer ' + token,
                ...params.headers,
            },
            signal,
            withCredentials: false,
        })
        .then((r) => r.data)

export const postUpload = (
    path: string,
    params: {
        body?: any
        query?: any
        headers?: any
    },
    token: string,
    signal?: AbortSignal
): Promise<unknown> =>
    requestUpload
        .post(path, params.body, {
            params: params.query,
            headers: {
                Authorization: 'Bearer ' + token,
                ...params.headers,
            },
            signal,
            withCredentials: false,
        })
        .then((r) => r.data)

export const get = (
    path: string,
    params: {
        body?: any
        query?: any
    },
    token: string,
    signal?: AbortSignal
): Promise<unknown> =>
    request
        .get(path, {
            params: params.query,
            signal,
            headers: {
                Authorization: 'Bearer ' + token,
            },
            withCredentials: false,
        })
        .then((r) => r.data)
