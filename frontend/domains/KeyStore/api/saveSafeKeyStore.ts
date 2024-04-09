import { post } from '@zeal/api/request'

import { Safe4337 } from '@zeal/domains/KeyStore'

type SaveSafeKeystoreParams = {
    keystore: Safe4337
    signal?: AbortSignal
}

export const saveSafeKeyStore = async ({
    keystore,
    signal,
}: SaveSafeKeystoreParams): Promise<void> => {
    const {
        recoveryId,
        publicKey: { xCoordinate, yCoordinate },
    } = keystore.safeDeplymentConfig.passkeyOwner

    const x = xCoordinate.slice(2)
    const y = yCoordinate.slice(2)

    return post(
        '/wallet/smart-wallet',
        {
            body: {
                address: keystore.address,
                recoveryId,
                xyCoordinates: `0x${x}${y}`,
            },
        },
        signal
    ).then(() => undefined)
}
