import 'cbor-rn-prereqs' // This has to be done here to get CBOR working in React Native
import cbor from 'cbor'

import { encrypt } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { Safe4337 } from '@zeal/domains/KeyStore'
import { getPredictedPasskeySignerAddress } from '@zeal/domains/KeyStore/helpers/getPredicted4337PasskeySignerAddress'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'

type AuthenticatorData = {
    rpIdHash: Uint8Array
    flags: {
        userPresence: boolean
        userVerified: boolean
        backupEligibility: boolean
        backupState: boolean
        attestedCredentialDataIncluded: boolean
        extensionDataIncluded: boolean
    }
    signCount: number
    signCountBuffer: Uint8Array
    aaGUID: Uint8Array
    credentialId: Uint8Array
    publicKey: Uint8Array
}
export const createPasskeyOwner = async ({
    recoveryIdBuffer,
    attestationBuffer,
    networkRPCMap,
    network,
    sessionPassword,
}: {
    recoveryIdBuffer: Uint8Array
    attestationBuffer: Uint8Array
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
}): Promise<Safe4337['safeDeplymentConfig']['passkeyOwner']> => {
    const attestation = cbor.decode(attestationBuffer)
    const authData = parseAuthenticatorData(attestation.authData)

    const point = cbor.decodeAllSync(authData.publicKey)[0]

    const x = point.get(-2)
    const y = point.get(-3)

    const publicKeyData: Safe4337['safeDeplymentConfig']['passkeyOwner']['publicKey'] =
        {
            xCoordinate: Hexadecimal.fromBuffer(Buffer.from(x)),
            yCoordinate: Hexadecimal.fromBuffer(Buffer.from(y)),
        }

    const recoveryId = Hexadecimal.fromBuffer(recoveryIdBuffer)

    const predictedSignerAddress = await getPredictedPasskeySignerAddress({
        network,
        networkRPCMap,
        publicKeyData,
        recoveryId,
    })

    const encryptedCredentialId = await encrypt(
        sessionPassword,
        Hexadecimal.fromBuffer(authData.credentialId)
    )

    return {
        recoveryId,
        signerAddress: predictedSignerAddress,
        publicKey: publicKeyData,
        encryptedCredentialId,
    }
}

const parseAuthenticatorData = (
    authDataBuffer: Uint8Array
): AuthenticatorData => {
    const rpIdHash = authDataBuffer.slice(0, 32)
    authDataBuffer = authDataBuffer.slice(32)

    const flagsBuffer = authDataBuffer.slice(0, 1)
    authDataBuffer = authDataBuffer.slice(1)

    const flagsInt = flagsBuffer[0]
    const signCountBuffer = authDataBuffer.slice(0, 4)
    authDataBuffer = authDataBuffer.slice(4)

    const signCount = Buffer.from(signCountBuffer).readUInt32BE(0)
    const aaGUID = authDataBuffer.slice(0, 16)
    authDataBuffer = authDataBuffer.slice(16)

    const credentialIdLengthBuffer = authDataBuffer.slice(0, 2)
    authDataBuffer = authDataBuffer.slice(2)
    const credentialIdLength = Buffer.from(
        credentialIdLengthBuffer
    ).readUInt16BE(0)
    const credentialId = authDataBuffer.slice(0, credentialIdLength)

    authDataBuffer = authDataBuffer.slice(credentialIdLength)
    const publicKey = authDataBuffer

    // Bit positions: https://www.w3.org/TR/webauthn-2/#flags
    const flags: AuthenticatorData['flags'] = {
        userPresence: !!(flagsInt & (1 << 0)),
        userVerified: !!(flagsInt & (1 << 2)),
        backupEligibility: !!(flagsInt & (1 << 3)),
        backupState: !!(flagsInt & (1 << 4)),
        attestedCredentialDataIncluded: !!(flagsInt & (1 << 6)),
        extensionDataIncluded: !!(flagsInt & (1 << 7)),
    }

    return {
        rpIdHash,
        flags,
        signCount,
        signCountBuffer,
        aaGUID,
        credentialId,
        publicKey,
    }
}
