import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { signMessage } from '@zeal/domains/RPCRequest/helpers/signMessage'

import { UserOperationHash } from '../UserOperation'

export const signUserOperationHashWithLocalSigner = async ({
    keyStore,
    network,
    sessionPassword,
    userOperationHash,
}: {
    userOperationHash: UserOperationHash
    keyStore: Safe4337
    sessionPassword: string
    network: Network
}): Promise<string> => {
    const { localSignerKeyStore } = keyStore

    const signature = await signMessage({
        request: {
            id: generateRandomNumber(),
            jsonrpc: '2.0',
            method: 'personal_sign',
            params: [userOperationHash.hash],
        },
        keyStore: localSignerKeyStore,
        network,
        sessionPassword,
    })

    const safeSignature = adjustVInSignature(signature)

    const validFrom = userOperationHash.encodedValidFrom.slice(2)
    const validUntil = userOperationHash.encodedValidUntil.slice(2)
    const signatureData = safeSignature.slice(2)

    return `0x${validFrom}${validUntil}${signatureData}`
}

// https://docs.safe.global/sdk/protocol-kit/guides/signatures/transactions
const adjustVInSignature = (signature: string): string => {
    const ETHEREUM_V_VALUES = [
        0, // Contract signature
        1, // Approved hash
        27, // EIP-191 signed message
        28, // EIP-191 signed message
    ]
    const MIN_VALID_V_VALUE_FOR_SAFE_ECDSA = 27
    const EIP_191_ADJUSTMENT = 4

    const signatureVComponent = parseInt(signature.slice(-2), 16)

    if (!ETHEREUM_V_VALUES.includes(signatureVComponent)) {
        throw new Error('Cannot adjust v component in invalid signature')
    }

    const adjustedVComponent =
        signatureVComponent < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA
            ? signatureVComponent +
              MIN_VALID_V_VALUE_FOR_SAFE_ECDSA +
              EIP_191_ADJUSTMENT
            : signatureVComponent + EIP_191_ADJUSTMENT

    return signature.slice(0, -2) + adjustedVComponent.toString(16)
}
