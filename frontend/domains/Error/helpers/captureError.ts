import { captureAppError } from './captureAppError'

import { parseAppError } from '../parsers/parseAppError'

type Params = {
    extra?: Record<string, unknown>
}

export const captureError = (error: unknown, params?: Params): void =>
    captureAppError(parseAppError(error), {
        source: 'manually_captured',
        extra: params?.extra,
    })
