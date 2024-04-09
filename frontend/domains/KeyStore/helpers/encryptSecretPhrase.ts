import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

import { encrypt } from '@zeal/toolkit/Crypto'

import { DecryptedPhraseEntropyString } from '@zeal/domains/KeyStore'

type Params = {
    mnemonic: string
    sessionPassword: string
}

export const encryptSecretPhrase = async ({
    sessionPassword,
    mnemonic,
}: Params): Promise<string> => {
    const entropy = Buffer.from(
        bip39.mnemonicToEntropy(mnemonic, wordlist)
    ).toString('hex')
    const decryptedPhraseEntropyString: DecryptedPhraseEntropyString = {
        type: 'decrypted_phrase_entropy_string',
        entropy,
    }
    return encrypt(sessionPassword, decryptedPhraseEntropyString)
}
