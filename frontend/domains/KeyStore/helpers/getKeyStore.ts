import { Address } from '@zeal/domains/Address'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'

export const getKeyStore = ({
    address,
    keyStoreMap,
}: {
    keyStoreMap: KeyStoreMap
    address: Address
}): KeyStore => {
    const keyStore: KeyStore | null =
        (keyStoreMap as Record<Address, KeyStore>)[address] || null

    return keyStore || { type: 'track_only' }
}
