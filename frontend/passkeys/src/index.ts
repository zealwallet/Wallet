import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { base64Encode, base64UrlEncode } from '@zeal/toolkit/String/base64'

import {
    parseAndroidCreationResponse,
    parseAndroidSignatureResponse,
    parsePasskeyCreationResponse,
    parsePasskeySignatureResponse,
    parseWebCreationResponse,
    parseWebSignatureResponse,
} from './parsers'
import PasskeysModule from './PasskeysModule'

export type PasskeyCreationRequest = {
    challenge: Uint8Array
    userId: Uint8Array
    userName: string
    rpId: string
}

export type PasskeyCreationResponse = {
    credentialId: Uint8Array
    attestationObject: Uint8Array
    clientDataJSON: Uint8Array
}

export type PasskeySignatureRequest = {
    challenge: Uint8Array
    rpId: string
    allowedCredentials: Uint8Array[]
}

export type PasskeySignatureResponse = {
    credentialId: Uint8Array
    userId: Uint8Array | null // On cross-platform signatures with a non-empty allowCredentials list, Android returns null. This should be fine since you should have the userId if you have the credentialId https://groups.google.com/a/fidoalliance.org/g/fido-dev/c/v6JBaTsNv08
    signature: Uint8Array
    clientDataJSON: Uint8Array
    authenticatorData: Uint8Array
}

type AndroidCreateRequest = {
    rp: {
        id: string
        name: string
    }
    user: {
        id: string
        name: string
        displayName: string
    }
    challenge: string
    pubKeyCredParams: {
        type: 'public-key'
        alg: -7
    }[]
    authenticatorSelection: {
        requireResidentKey: true
        residentKey: 'required'
        authenticatorAttachment: 'platform' | 'cross-platform'
    }
}

type AndroidSignRequest = {
    rpId: string
    challenge: string
    allowCredentials?: {
        type: 'public-key'
        id: string
    }[]
}

export const createPasskey = async (
    request: PasskeyCreationRequest
): Promise<PasskeyCreationResponse> => {
    switch (ZealPlatform.OS) {
        case 'ios': {
            const nativeResponse = await PasskeysModule.createPasskeyCredential(
                base64Encode(request.challenge),
                base64Encode(request.userId),
                request.userName,
                request.rpId
            )

            return parsePasskeyCreationResponse(
                nativeResponse
            ).getSuccessResultOrThrow(
                'Failed to parse native IOS passkey creation response'
            )
        }
        case 'android': {
            const nativeResponse = await PasskeysModule.createPasskeyCredential(
                buildAndroidCreateRequestJson(request)
            )

            return parseAndroidCreationResponse(
                nativeResponse
            ).getSuccessResultOrThrow(
                'Failed to parse native Android passkey creation response'
            )
        }

        case 'web': {
            const webResponse = await PasskeysModule.createPasskeyCredential(
                buildWebCreationRequest(request)
            )

            return parseWebCreationResponse(
                webResponse
            ).getSuccessResultOrThrow(
                'Failed to parse web passkey creation response'
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const signWithPasskey = async (
    request: PasskeySignatureRequest
): Promise<PasskeySignatureResponse> => {
    switch (ZealPlatform.OS) {
        case 'ios': {
            const nativeResponse =
                await PasskeysModule.signWithPasskeyCredential(
                    base64Encode(request.challenge),
                    request.allowedCredentials?.map(base64Encode),
                    request.rpId
                )

            return parsePasskeySignatureResponse(
                nativeResponse
            ).getSuccessResultOrThrow(
                'Failed to parse native IOS passkey signature response'
            )
        }
        case 'android': {
            const nativeResponse =
                await PasskeysModule.signWithPasskeyCredential(
                    buildAndroidSignRequestJson(request)
                )

            return parseAndroidSignatureResponse(
                nativeResponse
            ).getSuccessResultOrThrow(
                'Failed to parse native Android passkey signature response'
            )
        }
        case 'web': {
            const webResponse = await PasskeysModule.signWithPasskeyCredential(
                buildWebSignRequest(request)
            )

            return parseWebSignatureResponse(
                webResponse
            ).getSuccessResultOrThrow(
                'Failed to parse web passkey signature response'
            )
        }
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

const buildAndroidCreateRequestJson = (
    request: PasskeyCreationRequest
): string => {
    const creationRequest: AndroidCreateRequest = {
        rp: {
            id: request.rpId,
            name: request.rpId,
        },
        user: {
            id: base64UrlEncode(base64Encode(request.userId)),
            name: request.userName,
            displayName: request.userName,
        },
        challenge: base64UrlEncode(base64Encode(request.challenge)),
        pubKeyCredParams: [
            {
                type: 'public-key',
                alg: -7,
            },
        ],
        authenticatorSelection: {
            requireResidentKey: true,
            residentKey: 'required',
            authenticatorAttachment: 'platform',
        },
    }
    return JSON.stringify(creationRequest)
}

const buildWebCreationRequest = (
    request: PasskeyCreationRequest
): PublicKeyCredentialCreationOptions => ({
    challenge: request.challenge,
    rp: { name: 'Zeal Wallet', id: request.rpId },
    user: {
        id: request.userId, // This has to be random otherwise existing passkey will be replaced
        name: request.userName, // This shows up in passkey list modal for user to differentiate between passkeys
        displayName: request.userName, // Not used in browser modals yet
    },
    authenticatorSelection: {
        // If this is left out, IOS creates discoverable credentials by default, but Android creates non-discoverable credentials - https://docs.turnkey.com/passkeys/options#requireresidentkey-and-residentkey
        requireResidentKey: true,
        residentKey: 'required',
        authenticatorAttachment: 'cross-platform',
    },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    timeout: 300000, // Ugly timeout UI shown to user if this value is small and user takes long
})

const buildWebSignRequest = (
    request: PasskeySignatureRequest
): PublicKeyCredentialRequestOptions => ({
    challenge: request.challenge,
    allowCredentials: request.allowedCredentials.map((credentialId) => ({
        type: 'public-key',
        id: credentialId,
    })),
    timeout: 300000,
    rpId: request.rpId,
})

const buildAndroidSignRequestJson = (
    request: PasskeySignatureRequest
): string => {
    const signRequest: AndroidSignRequest = {
        rpId: request.rpId,
        challenge: base64UrlEncode(base64Encode(request.challenge)),
        allowCredentials: request.allowedCredentials.map((credentialId) => ({
            type: 'public-key',
            id: base64UrlEncode(base64Encode(credentialId)),
        })),
    }

    return JSON.stringify(signRequest)
}
