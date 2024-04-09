import { uuid } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import {
    boolean,
    match,
    number,
    object,
    oneOf,
    recordStrict,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { parse as parseAddress } from '@zeal/domains/Address/helpers/parse'
import { parseIndexKey } from '@zeal/domains/Address/helpers/parseIndexKey'
import {
    KeyStoreMap,
    LEDGER,
    PrivateKey,
    Safe4337,
    SecretPhrase,
    TrackOnly,
    Trezor,
} from '@zeal/domains/KeyStore'

export const parse = (input: unknown): Result<unknown, KeyStoreMap> =>
    object(input)
        .andThen(parseIndexKey)
        .andThen((obj) =>
            recordStrict(obj, {
                keyParser: parseAddress,
                valueParser: (o) =>
                    oneOf(o, [
                        parsePrivateKey(o),
                        parseLedger(o),
                        parseSecretPhrase(o),
                        parseTrezor(o),
                        parseSafe4337(o),
                        parseTrackOnly(o),
                        // as a guard to fail to parse full keystore map
                        success({ type: 'track_only', id: uuid() } as const),
                    ]),
            })
        )

const parseTrackOnly = (input: unknown): Result<unknown, TrackOnly> => {
    return object(input).andThen((obj) => {
        return shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'track_only' as const),
        })
    })
}

const parseTrezor = (input: unknown): Result<unknown, Trezor> => {
    return object(input).andThen((obj) => {
        return shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'trezor' as const),
            address: string(obj.address),
            path: string(obj.path),
        })
    })
}

const parseLedger = (input: unknown): Result<unknown, LEDGER> => {
    return object(input).andThen((obj) => {
        return shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'ledger' as const),
            address: string(obj.address),
            path: string(obj.path),
        })
    })
}

const parseSecretPhrase = (input: unknown): Result<unknown, SecretPhrase> =>
    object(input).andThen((obj) =>
        shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'secret_phrase_key' as const),
            bip44Path: string(obj.bip44Path),
            encryptedPhrase: string(obj.encryptedPhrase),
            confirmed: oneOf(obj.confirmed, [
                boolean(obj.confirmed),
                success(true),
            ]),
            googleDriveFile: oneOf(obj.googleDriveFile, [
                object(obj.googleDriveFile).andThen((file) =>
                    shape({
                        id: string(file.id),
                        modifiedTime: number(file.modifiedTime),
                    })
                ),
                success(null),
            ]),
        })
    )

const parsePrivateKey = (input: unknown): Result<unknown, PrivateKey> => {
    return object(input).andThen((obj) =>
        shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'private_key_store' as const),
            address: string(obj.address),
            encryptedPrivateKey: string(obj.encryptedPrivateKey),
        })
    )
}

const parsePasskey = (
    input: unknown
): Result<unknown, Safe4337['safeDeplymentConfig']['passkeyOwner']> =>
    object(input).andThen((obj) =>
        shape({
            encryptedCredentialId: string(obj.encryptedCredentialId),
            recoveryId: string(obj.recoveryId).andThen(
                Hexadecimal.parseFromString
            ),
            publicKey: object(obj.publicKey).andThen((publicKey) =>
                shape({
                    xCoordinate: string(publicKey.xCoordinate).andThen(
                        Hexadecimal.parseFromString
                    ),
                    yCoordinate: string(publicKey.yCoordinate).andThen(
                        Hexadecimal.parseFromString
                    ),
                })
            ),
            signerAddress: string(obj.signerAddress),
        })
    )

const parseSafe4337 = (input: unknown): Result<unknown, Safe4337> => {
    return object(input).andThen((obj) =>
        shape({
            id: oneOf('id', [string(obj.id), success(uuid())]),
            type: match(obj.type, 'safe_4337' as const),
            address: string(obj.address),
            localSignerKeyStore: parsePrivateKey(obj.localSignerKeyStore),

            safeDeplymentConfig: object(obj.safeDeplymentConfig).andThen(
                (config) =>
                    shape({
                        threshold: number(config.threshold),
                        saltNonce: string(config.saltNonce),
                        passkeyOwner: parsePasskey(config.passkeyOwner),
                    })
            ),
        })
    )
}
