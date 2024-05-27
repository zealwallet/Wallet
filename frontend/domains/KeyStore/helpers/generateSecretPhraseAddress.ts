import * as Web3 from '@zeal/toolkit/Web3'

import { Address } from '@zeal/domains/Address'
import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'

type Params = {
    sessionPassword: string
    encryptedPhrase: string
    offset: number
}

export const generateSecretPhraseAddress = async ({
    encryptedPhrase,
    offset,
    sessionPassword,
}: Params): Promise<{ address: Address; path: string }> => {
    const path = `m/44'/60'/0'/0/${offset}`
    return generateSecretPhraseAddressOnPath({
        encryptedPhrase,
        path,
        sessionPassword,
    })
}

export const generateSecretPhraseAddressOnPath = async ({
    encryptedPhrase,
    path,
    sessionPassword,
}: {
    sessionPassword: string
    encryptedPhrase: string
    path: string
}): Promise<{ address: Address; path: string }> => {
    const decryptedPhrase = await decryptSecretPhrase({
        encryptedPhrase,
        sessionPassword,
    })

    const { address } = await Web3.privateKey.fromMnemonic(
        decryptedPhrase,
        path as `m/44'/60'/0'/0/${string}`
    )
    const parsedAddress = fromString(address).getSuccessResultOrThrow(
        'cannot parse address in generateSecretPhraseAddressOnPath'
    )

    return { address: parsedAddress, path }
}
