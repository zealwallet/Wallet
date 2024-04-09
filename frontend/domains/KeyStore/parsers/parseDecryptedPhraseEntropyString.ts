import { match, object, Result, shape, string } from '@zeal/toolkit/Result'

import { DecryptedPhraseEntropyString } from '@zeal/domains/KeyStore'

export const parseDecryptedPhraseEntropyString = (
    input: unknown
): Result<unknown, DecryptedPhraseEntropyString> =>
    object(input).andThen((obj) =>
        shape({
            type: match(obj.type, 'decrypted_phrase_entropy_string' as const),
            entropy: string(obj.entropy),
        })
    )
