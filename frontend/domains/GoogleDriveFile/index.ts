import { failure, Result, success } from '@zeal/toolkit/Result'

export type File = {
    id: string
    name: string
    modifiedTime: number
}

export class FailedToFetchGoogleAuthToken extends Error {
    isFailedToFetchGoogleAuthToken = true
    type: 'failed_to_fetch_google_auth_token'
    name: string = 'FailedToFetchGoogleAuthToken'
    error: unknown

    constructor(error: unknown) {
        super('Failed to fetch google auth token')
        this.error = error
        this.type = 'failed_to_fetch_google_auth_token'
    }
}

export const parseFailedToFetchGoogleAuthToken = (
    e: unknown
): Result<unknown, FailedToFetchGoogleAuthToken> =>
    e instanceof FailedToFetchGoogleAuthToken &&
    e.type === 'failed_to_fetch_google_auth_token'
        ? success(e)
        : failure('incorrect instance')
