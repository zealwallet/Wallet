import { privateKeyToAccount } from 'viem/accounts'

import { failure, Result, success } from '@zeal/toolkit/Result'

export type NotValidPrivateKey = { type: 'not_valid_private_key' }

export const validatePrivateKey = (
    privateKey: string
): Result<NotValidPrivateKey, string> => {
    const trimmedPK = cleanPK(privateKey)
    try {
        privateKeyToAccount(`0x${trimmedPK}`)

        return success(trimmedPK)
    } catch (e) {
        return failure({ type: 'not_valid_private_key' })
    }
}

const cleanPK = (input: string): string => {
    const trimmedPK = input.trim()
    return trimmedPK.startsWith('0x') ? trimmedPK.substring(2) : trimmedPK
}
