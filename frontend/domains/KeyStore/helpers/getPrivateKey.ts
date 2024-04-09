import { notReachable } from '@zeal/toolkit'
import { decrypt } from '@zeal/toolkit/Crypto'
import { string } from '@zeal/toolkit/Result'
import * as Web3 from '@zeal/toolkit/Web3'

import { Address } from '@zeal/domains/Address'
import { PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { decryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/decryptSecretPhrase'

export const getPrivateKey = async ({
    keyStore,
    sessionPassword,
}: {
    sessionPassword: string
    keyStore: PrivateKey | SecretPhrase
}): Promise<{ address: Address; pk: string }> => {
    switch (keyStore.type) {
        case 'private_key_store': {
            const pk = await decrypt(
                sessionPassword,
                keyStore.encryptedPrivateKey,
                string
            )
            return { address: keyStore.address, pk: `0x${pk}` }
        }

        case 'secret_phrase_key': {
            const decryptedSecretPhrase = await decryptSecretPhrase({
                encryptedPhrase: keyStore.encryptedPhrase,
                sessionPassword,
            })
            const pk = await Web3.privateKey.fromMnemonic(
                decryptedSecretPhrase,
                // TODO :: this is more or less safe conversion only string can be casted to `m/44'/60'/0'/0/${string}` string, but we need to change keystore type
                // this typing should also applied to addressed / pks like '0x${string}'
                keyStore.bip44Path as `m/44'/60'/0'/0/${string}`
            )

            return {
                address: pk.address,
                pk: pk.privateKey,
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}
