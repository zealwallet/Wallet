import { secp256k1 } from '@noble/curves/secp256k1'
import { HDKey } from 'viem/accounts'
import { publicKeyToAddress } from 'viem/utils'

import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { ImperativeError } from '@zeal/domains/Error'

export const fromExtendedPublicKey = (
    key: string,
    index: number
): Hexadecimal.Hexadecimal => {
    const publicKey = HDKey.fromExtendedKey(key).derive(`m/${index}`).publicKey

    if (!publicKey) {
        throw new ImperativeError(
            'Public key not found when deriving address from extended public key'
        )
    }

    const publicKeyHex = Hexadecimal.fromBuffer(publicKey)
    const point = secp256k1.ProjectivePoint.fromHex(
        Hexadecimal.remove0x(publicKeyHex)
    ) // May not be needed if https://github.com/wevm/viem/discussions/2044 is ever implemented
    const uncompressedPublicKeyHex = Hexadecimal.fromBuffer(
        point.toRawBytes(false) // false means we want the uncompressed public key
    )

    return publicKeyToAddress(uncompressedPublicKeyHex)
}
