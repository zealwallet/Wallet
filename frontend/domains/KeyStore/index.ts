import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

import { Address } from '@zeal/domains/Address'

export type KeyStore = EOA | Safe4337 | TrackOnly

export type EOA = PrivateKey | LEDGER | SecretPhrase | Trezor

export type SigningKeyStore = EOA | Safe4337

export type PrivateKey = {
    id: string
    type: 'private_key_store'
    address: Address
    encryptedPrivateKey: string
}

export type Trezor = {
    id: string
    type: 'trezor'
    address: Address
    path: string
}

export type LEDGER = {
    id: string
    type: 'ledger'
    address: Address
    path: string
}

export type DecryptedPhraseEntropyString = {
    type: 'decrypted_phrase_entropy_string'
    entropy: string
}

export type SecretPhrase = {
    id: string
    type: 'secret_phrase_key'
    encryptedPhrase: string
    bip44Path: string
    confirmed: boolean
    googleDriveFile: {
        modifiedTime: number
        id: string
    } | null
}

type Passkey = {
    encryptedCredentialId: string
    recoveryId: Hexadecimal.Hexadecimal
    publicKey: {
        xCoordinate: Hexadecimal.Hexadecimal
        yCoordinate: Hexadecimal.Hexadecimal
    }
    signerAddress: Address
}

export type Safe4337 = {
    id: string
    type: 'safe_4337'
    address: Address
    localSignerKeyStore: PrivateKey

    safeDeplymentConfig: {
        passkeyOwner: Passkey
        threshold: number
        saltNonce: string
    }
}

export type TrackOnly = {
    id: string
    type: 'track_only'
}

declare const KeyStoreMapIndexSymbol: unique symbol

export type KeyStoreMap = Record<
    Address & {
        __keystoreMapIndex: typeof KeyStoreMapIndexSymbol
    },
    KeyStore
>
