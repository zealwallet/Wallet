import { Address } from '@zeal/domains/Address'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'

export const addKeyStore = ({
    address,
    keyStoreMap,
    keyStore,
}: {
    keyStoreMap: KeyStoreMap
    address: Address
    keyStore: KeyStore
}): KeyStoreMap => ({ ...keyStoreMap, [address]: keyStore })
