import Web3 from 'web3'

import { failure, Result, success } from '@zeal/toolkit/Result'

export type NotValidPrivateKey = { type: 'not_valid_private_key' }

export const validatePrivateKey = (
    privateKey: string
): Result<NotValidPrivateKey, string> => {
    const trimmedPK = cleanPK(privateKey)
    try {
        new Web3().eth.accounts.privateKeyToAccount('0x' + trimmedPK)

        return success(trimmedPK)
    } catch (e) {
        return failure({ type: 'not_valid_private_key' })
    }
}

const cleanPK = (input: string): string => {
    const trimmedPK = input.trim()
    return trimmedPK.startsWith('0x') ? trimmedPK.substring(2) : trimmedPK
}
