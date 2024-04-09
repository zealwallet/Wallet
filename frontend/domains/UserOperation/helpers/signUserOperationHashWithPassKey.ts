import { signWithPasskey } from '@zeal/passkeys'
import Web3 from 'web3'

import { decrypt, encodeAbiParameters } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { toHex } from '@zeal/toolkit/Number'
import { string } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'
import { Safe4337 } from '@zeal/domains/KeyStore'

import { UserOperationHash } from '../UserOperation'

const CHALLENGE_JSON_KEY_HEX = '0x226368616c6c656e6765223a' // hex for "challenge":
const CHALLENGE_JSON_KEY_LENGTH = 12 // length of "challenge": in bytes

export const signUserOperationHashWithPassKey = async ({
    passkey,
    userOperationHash,
    sessionPassword,
}: {
    userOperationHash: UserOperationHash
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    sessionPassword: string
}): Promise<string> => {
    const {
        encodedValidFrom,
        encodedValidUntil,
        hash: userOpHash,
    } = userOperationHash

    const challenge = hexToBuffer(userOpHash.slice(2))

    const decryptedCredentialId = await decrypt(
        sessionPassword,
        passkey.encryptedCredentialId,
        string
    )

    const { signature, authenticatorData, clientDataJSON } =
        await signWithPasskey({
            challenge,
            rpId: 'sample-associated-domain.web.app',
            allowedCredentials: [hexToBuffer(decryptedCredentialId)],
        })

    const [r, s] = derToRS(signature)

    const challengeKeyIndex = indexOfSequence(
        clientDataJSON,
        hexToBuffer(CHALLENGE_JSON_KEY_HEX)
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

    const formattedSignature = formatSignatureForSafe(
        passkey.signerAddress,
        encodedSignature
    )

    const validFrom = encodedValidFrom.slice(2)
    const validUntil = encodedValidUntil.slice(2)
    const signatureData = formattedSignature.slice(2)

    return `0x${validFrom}${validUntil}${signatureData}`
}

const formatSignatureForSafe = (
    signerAddress: string,
    signature: string
): string => {
    const web3 = new Web3()

    // r component
    const verifierAndDataPosition = web3.eth.abi.encodeParameters(
        ['uint256', 'uint256'],
        [signerAddress, 65]
    )

    const signatureType = '00' // v component

    const signatureLength = Web3.utils.hexToBytes(signature).length

    const paddedSignatureLength = Web3.utils
        .padLeft(toHex(signatureLength), 64)
        .slice(2)

    const verifiedSignature = signature.slice(2) // s component

    return `${verifierAndDataPosition}${signatureType}${paddedSignatureLength}${verifiedSignature}`
}

const hexToBuffer = (hex: string): Uint8Array => {
    const matches = hex.match(/[\da-f]{2}/gi)

    if (!matches) {
        throw new ImperativeError('Invalid hex string', { hex })
    }
    return new Uint8Array(matches.map((h) => parseInt(h, 16)))
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
