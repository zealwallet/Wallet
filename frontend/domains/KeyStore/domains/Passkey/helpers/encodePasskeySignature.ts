import { PasskeySignatureResponse } from '@zeal/passkeys'

import { encodeAbiParameters } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { toHex } from '@zeal/toolkit/Number'

import { Passkey } from '@zeal/domains/KeyStore/domains/Passkey'

const CHALLENGE_JSON_KEY_HEX = '0x226368616c6c656e6765223a' // hex for "challenge":
const CHALLENGE_JSON_KEY_LENGTH = 12 // length of "challenge": in bytes

export const encodePasskeySignature = (
    passkey: Passkey,
    signatureResponse: PasskeySignatureResponse
): Hexadecimal.Hexadecimal => {
    const { signature, authenticatorData, clientDataJSON } = signatureResponse

    const [r, s] = derToRS(signature)

    const challengeKeyIndex = indexOfSequence(
        clientDataJSON,
        new Uint8Array(Hexadecimal.toBuffer(CHALLENGE_JSON_KEY_HEX))
    )

    const challengeIndex = challengeKeyIndex + CHALLENGE_JSON_KEY_LENGTH + 1 // account for opening quote

    const encodedSignature = encodeAbiParameters(
        [
            { type: 'bytes' },
            { type: 'bytes' },
            { type: 'uint256' },
            { type: 'uint256[2]' },
        ],
        [
            Hexadecimal.fromBuffer(authenticatorData),
            Hexadecimal.fromBuffer(clientDataJSON),
            BigInt(challengeIndex),
            [
                BigInt(Hexadecimal.fromBuffer(r)),
                BigInt(Hexadecimal.fromBuffer(s)),
            ],
        ]
    )

    return formatSignatureForSafe(passkey.signerAddress, encodedSignature)
}

const formatSignatureForSafe = (
    signerAddress: string,
    signature: Hexadecimal.Hexadecimal
): Hexadecimal.Hexadecimal => {
    // r component
    const verifierAndDataPosition = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'uint256' }],
        [BigInt(signerAddress), 65n]
    )

    const signatureType = '00' // v component

    const signatureLength = Hexadecimal.toBuffer(signature).byteLength

    const paddedSignatureLength = Hexadecimal.remove0x(
        toHex(signatureLength)
    ).padStart(64, '0')

    const verifiedSignature = signature.slice(2) // s component

    return `${verifierAndDataPosition}${signatureType}${paddedSignatureLength}${verifiedSignature}`
}

const derToRS = (der: Uint8Array): [Uint8Array, Uint8Array] => {
    let offset = 3
    let dataOffset

    if (der[offset] === 0x21) {
        dataOffset = offset + 2
    } else {
        dataOffset = offset + 1
    }
    const r = der.slice(dataOffset, dataOffset + 32)
    offset = offset + der[offset] + 1 + 1
    if (der[offset] === 0x21) {
        dataOffset = offset + 2
    } else {
        dataOffset = offset + 1
    }

    const s = der.slice(dataOffset, dataOffset + 32)
    return [r, s]
}

const indexOfSequence = (target: Uint8Array, sequence: Uint8Array): number => {
    for (let i = 0; i < target.length; ++i) {
        for (let j = 0; j < sequence.length; j++) {
            if (target[i + j] !== sequence[j]) {
                break
            }
            if (j === sequence.length - 1) {
                return i
            }
        }
    }
    return -1
}
