import { AxiosError } from 'axios'

import { HttpError } from '@zeal/domains/Error'

export const convertToHttpErrorToPreserverStack = (error: unknown) => {
    if (error instanceof AxiosError) {
        const status = error.response?.status || null
        const trace = error.response?.headers?.['trace-id'] || null
        const data = error.response?.data
        const { url, method, params } = error.config

        if (url && method) {
            const newError = new HttpError(
                url,
                method,
                status,
                trace,
                data,
                params
            )
            newError.stack = error.stack

            // We return customized error if we were able to collect data for it
            return Promise.reject(newError)
        }

        return Promise.reject(error)
    }

    return Promise.reject(error)
}
