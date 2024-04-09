import { Buffer } from 'buffer'

import { failure, Result, success } from '../Result'

export const tryDecodeBase64 = (
    encoded: string
): Result<{ type: 'cannot decode string'; value: string }, string> => {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8')
        return success(decoded)
    } catch (e) {
        return failure({ type: 'cannot decode string', value: encoded })
    }
}
