import { Address } from '@zeal/domains/Address'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'

export const removeKeyStore = ({
    address,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    address: Address
}): KeyStoreMap => {
    const { [address]: _, ...remainingKeyStoreMap } = keyStoreMap as Record<
        Address,
        KeyStore
    >

    return remainingKeyStoreMap
}
