import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

import { encryptSecretPhrase } from './encryptSecretPhrase'

type Params = {
    sessionPassword: string
}

const MNEMONIC_STRENGTH_BITS = 128

/**
 * Generate and return new secret phrase (mnemonic) encrypted with session password
 */
export const generateSecretPhrase = async ({
    sessionPassword,
}: Params): Promise<string> => {
    const mnemonic = bip39.generateMnemonic(wordlist, MNEMONIC_STRENGTH_BITS)

    return await encryptSecretPhrase({
        sessionPassword,
        mnemonic,
    })
}
