import {
    createPasskey as createPasskeyInApp,
    PasskeyCreationRequest,
    PasskeyCreationResponse,
} from '@zeal/passkeys'

import { delay } from '@zeal/toolkit/delay'

import { ImperativeError } from '@zeal/domains/Error'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { ZEAL_PASSKEY_DOMAIN } from '@zeal/domains/KeyStore/constants'
import { Passkey } from '@zeal/domains/KeyStore/domains/Passkey'
import { createPasskeyOwner } from '@zeal/domains/KeyStore/domains/Passkey/helpers/createPasskeyOwner'
import { generatePasskeyName } from '@zeal/domains/KeyStore/domains/Passkey/helpers/generatePasskeyName'
import { generatePasskeyRecoveryId } from '@zeal/domains/KeyStore/domains/Passkey/helpers/generatePasskeyRecoveryId'
import { generateRandomPasskeyChallenge } from '@zeal/domains/KeyStore/domains/Passkey/helpers/generateRandomPasskeyChallenge'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'

export const createPasskey = async ({
    network,
    safeLabel,
    sessionPassword,
    networkRPCMap,
}: {
    network: Network
    safeLabel: string
    sessionPassword: string
    networkRPCMap: NetworkRPCMap
}): Promise<Passkey> => {
    const recoveryIdBuffer = generatePasskeyRecoveryId()

    const request: PasskeyCreationRequest = {
        userName: generatePasskeyName(safeLabel),
        userId: recoveryIdBuffer,
        challenge: generateRandomPasskeyChallenge(),
        rpId: ZEAL_PASSKEY_DOMAIN,
    }

    const response = await createPasskeyWithRetry(request, 0)

    return createPasskeyOwner({
        recoveryIdBuffer,
        sessionPassword,
        network,
        networkRPCMap,
        attestationBuffer: response.attestationObject,
    })
}

const MAX_RETRIES = 8
const RETRY_DELAY_MS = 2000

// TODO: @Nicvaniek Change API to take number of retries as a parameter
// Retries with backoff added due to an IOS issue where the AASA file check is not done immediately on fresh app install. Daimo has a similar issue https://github.com/daimo-eth/daimo/issues/837
export const createPasskeyWithRetry = async (
    request: PasskeyCreationRequest,
    retriesDone: number
): Promise<PasskeyCreationResponse> => {
    try {
        return await createPasskeyInApp(request)
    } catch (error) {
        const parsedError = parseAppError(error)

        switch (parsedError.type) {
            case 'app_not_associated_with_domain':
                if (retriesDone < MAX_RETRIES) {
                    await delay(RETRY_DELAY_MS)
                    return createPasskeyWithRetry(request, retriesDone + 1)
                }
                throw new ImperativeError(
                    'App association check failed after max retries done in create flow'
                )
            /* istanbul ignore next */
            default:
                throw error
        }
    }
}
