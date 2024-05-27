import { signWithPasskey } from '@zeal/passkeys'

import { decrypt } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { string } from '@zeal/toolkit/Result'

import { ZEAL_PASSKEY_DOMAIN } from '@zeal/domains/KeyStore/constants'
import { Passkey } from '@zeal/domains/KeyStore/domains/Passkey'
import { encodePasskeySignature } from '@zeal/domains/KeyStore/domains/Passkey/helpers/encodePasskeySignature'

import { UserOperationHash } from '../UserOperation'

export const signUserOperationHashWithPassKey = async ({
    passkey,
    userOperationHash,
    sessionPassword,
}: {
    userOperationHash: UserOperationHash
    passkey: Passkey
    sessionPassword: string
}): Promise<Hexadecimal.Hexadecimal> => {
    const {
        encodedValidFrom,
        encodedValidUntil,
        hash: userOpHash,
    } = userOperationHash

    const challenge = Hexadecimal.toBuffer(userOpHash)

    const decryptedCredentialId = await decrypt(
        sessionPassword,
        passkey.encryptedCredentialId,
        (input: unknown) => string(input).andThen(Hexadecimal.parseFromString)
    )

    const response = await signWithPasskey({
        challenge: new Uint8Array(challenge),
        rpId: ZEAL_PASSKEY_DOMAIN,
        allowedCredentials: [
            new Uint8Array(Hexadecimal.toBuffer(decryptedCredentialId)),
        ],
    })

    const encodedSignature = encodePasskeySignature(passkey, response)

    const validFrom = Hexadecimal.remove0x(encodedValidFrom)
    const validUntil = Hexadecimal.remove0x(encodedValidUntil)
    const signatureData = Hexadecimal.remove0x(encodedSignature)

    return `0x${validFrom}${validUntil}${signatureData}`
}
