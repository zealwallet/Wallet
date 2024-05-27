import {
    PasskeySignatureRequest,
    PasskeySignatureResponse,
    signWithPasskey,
} from '@zeal/passkeys'

import { encrypt } from '@zeal/toolkit/Crypto'
import { delay } from '@zeal/toolkit/delay'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { ImperativeError } from '@zeal/domains/Error'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { ZEAL_PASSKEY_DOMAIN } from '@zeal/domains/KeyStore/constants'
import { Passkey } from '@zeal/domains/KeyStore/domains/Passkey'
import { generateRandomPasskeyChallenge } from '@zeal/domains/KeyStore/domains/Passkey/helpers/generateRandomPasskeyChallenge'

export const getPasskeyId = async ({
    sessionPassword,
}: {
    sessionPassword: string
}): Promise<{
    encryptedCredentialId: Passkey['encryptedCredentialId']
    recoveryId: Passkey['recoveryId']
}> => {
    const request: PasskeySignatureRequest = {
        challenge: generateRandomPasskeyChallenge(),
        rpId: ZEAL_PASSKEY_DOMAIN,
        allowedCredentials: [],
    }
    const { credentialId, userId } = await signWithPasskeyWithRetry(request, 0)

    if (!userId) {
        throw new ImperativeError(
            'No userId returned by authenticator, so cannot get recoveryId from passkey'
        )
    }

    const encryptedCredentialId = await encrypt(
        sessionPassword,
        Hexadecimal.fromBuffer(credentialId)
    )

    return {
        encryptedCredentialId,
        recoveryId: Hexadecimal.fromBuffer(userId),
    }
}

const MAX_RETRIES = 8
const RETRY_DELAY_MS = 2000

// TODO: @Nicvaniek Change API to take number of retries as a parameter
// Retries with backoff added due to an IOS issue where the AASA file check is not done immediately on fresh app install. Daimo has a similar issue https://github.com/daimo-eth/daimo/issues/837
export const signWithPasskeyWithRetry = async (
    request: PasskeySignatureRequest,
    retriesDone: number
): Promise<PasskeySignatureResponse> => {
    try {
        return await signWithPasskey(request)
    } catch (error) {
        const parsedError = parseAppError(error)

        switch (parsedError.type) {
            case 'app_not_associated_with_domain':
                if (retriesDone < MAX_RETRIES) {
                    await delay(RETRY_DELAY_MS)
                    return signWithPasskeyWithRetry(request, retriesDone + 1)
                }
                throw new ImperativeError(
                    'App association check failed after max retries done in sign flow'
                )
            /* istanbul ignore next */
            default:
                throw error
        }
    }
}
