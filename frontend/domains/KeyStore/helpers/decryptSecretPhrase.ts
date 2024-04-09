import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

import { decrypt } from '@zeal/toolkit/Crypto'

import { parseDecryptedPhraseEntropyString } from '../parsers/parseDecryptedPhraseEntropyString'

type Params = {
    sessionPassword: string
    encryptedPhrase: string
}

export const decryptSecretPhrase = async ({
    encryptedPhrase,
    sessionPassword,
}: Params): Promise<string> => {
    const { entropy } = await decrypt(
        sessionPassword,
        encryptedPhrase,
        parseDecryptedPhraseEntropyString
    )

    return bip39.entropyToMnemonic(
        Uint8Array.from(Buffer.from(entropy, 'hex')),
        wordlist
    )
}
