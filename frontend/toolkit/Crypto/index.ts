import { NativeModules } from 'react-native'

import {
    decrypt as mmDecrypt,
    encrypt as mmEncrypt,
} from '@metamask/browser-passworder'
import { getRandomValues, randomUUID } from 'expo-crypto' // eslint-disable-line no-restricted-imports
import { encodeAbiParameters as viemEncodeAbiParameters } from 'viem/utils'

import { parse as parseJSON } from '../JSON'
import { notReachable } from '../notReachable'
import { ZealPlatform } from '../OS/ZealPlatform'
import { failure, object, Result, shape, string, success } from '../Result'

export const uuid = (): string => {
    return randomUUID()
}

export const getRandomIntArray: typeof getRandomValues = (arrayLike) => {
    return getRandomValues(arrayLike)
}

export const encrypt = async <R>(
    password: string,
    toEncrypt: R
): Promise<string> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            // FIXME @resetko-zeal explore potential errors
            return nativeEncrypt(password, toEncrypt)

        case 'web':
            return mmEncrypt(password, toEncrypt)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const decrypt = async <T>(
    password: string,
    encryptedString: string,
    parser: (input: unknown) => Result<unknown, T>
): Promise<T> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return nativeDecrypt(password, encryptedString)

        case 'web': {
            try {
                const parsed = parseEncryptedString(
                    encryptedString
                ).getSuccessResultOrThrow('encrypted string is invalid')

                const decoded = await mmDecrypt(password, parsed)
                return parser(decoded).getSuccessResultOrThrow(
                    'cannot parse encrypted object'
                )
            } catch (e) {
                if (e instanceof Error) {
                    if (e.message === 'Incorrect password') {
                        throw new DecryptIncorrectPassword()
                    }
                    if (e.message === 'encrypted string is invalid') {
                        throw new InvalidEncryptedFileFormat(e)
                    }
                    if (e.message === 'cannot parse encrypted object') {
                        throw new EncryptedObjectInvalidFormat(e)
                    }
                }

                throw e
            }
        }

        default:
            return notReachable(ZealPlatform.OS)
    }
}

const parseEncryptedString = (input: unknown): Result<unknown, string> =>
    string(input).andThen((s) =>
        parseJSON(s)
            .andThen(object)
            .andThen((obj) =>
                shape({
                    data: string(obj.data),
                    iv: string(obj.iv),
                    salt: string(obj.salt),
                })
            )
            .map(() => s)
    )

export class DecryptIncorrectPassword extends Error {
    isDecryptIncorrectPassword = true
    type: 'decrypt_incorrect_password'
    name: string = 'DecryptIncorrectPassword'

    constructor() {
        super('Incorrect password')
        this.type = 'decrypt_incorrect_password'
    }
}

export const parseDecryptIncorrectPassword = (
    e: unknown
): Result<unknown, DecryptIncorrectPassword> =>
    e instanceof DecryptIncorrectPassword &&
    e.type === 'decrypt_incorrect_password'
        ? success(e)
        : failure('not correct instance')

export class InvalidEncryptedFileFormat extends Error {
    isInvalidEncryptedFileFormat = true
    type: 'invalid_encrypted_file_format'
    name: string = 'DecryptIncorrectPassword'
    parsingError: unknown

    constructor(parsingError: unknown) {
        super('Invalid encrypted file format')
        this.type = 'invalid_encrypted_file_format'
        this.parsingError = parsingError
    }
}

export const parseInvalidEncryptedFileFormat = (
    e: unknown
): Result<unknown, InvalidEncryptedFileFormat> =>
    e instanceof InvalidEncryptedFileFormat &&
    e.type === 'invalid_encrypted_file_format'
        ? success(e)
        : failure('not correct instance')

export class EncryptedObjectInvalidFormat extends Error {
    isEncryptedObjectInvalidFormat = true
    type: 'encrypted_object_invalid_format'
    name: string = 'DecryptIncorrectPassword'
    parsingError: unknown

    constructor(parsingError: unknown) {
        super('Decrypt incorrect password')
        this.type = 'encrypted_object_invalid_format'
        this.parsingError = parsingError
    }
}

export const parseEncryptedObjectInvalidFormat = (
    e: unknown
): Result<unknown, EncryptedObjectInvalidFormat> =>
    e instanceof EncryptedObjectInvalidFormat &&
    e.type === 'encrypted_object_invalid_format'
        ? success(e)
        : failure('not correct instance')

const generateSalt = (byteCount: number): string => {
    const view = new Uint8Array(byteCount)
    getRandomValues(view)
    return btoa(String.fromCharCode.apply(null, [...view]))
}

const nativeKeyFromPassword = (
    password: string,
    salt: string
): Promise<string> =>
    NativeModules.Aes.pbkdf2(password, salt, 5000, 256, 'sha256')

const nativeEncrypt = async (
    password: string,
    object: unknown
): Promise<string> => {
    const salt = generateSalt(16)
    const iv = await NativeModules.Aes.randomKey(16)
    const key = await nativeKeyFromPassword(password, salt)
    const cipher = await NativeModules.Aes.encrypt(
        JSON.stringify(object),
        key,
        iv,
        'AES'
    )

    return JSON.stringify({ iv, cipher, salt })
}

const nativeDecrypt = async (password: string, encryptedString: string) => {
    const encryptedData: { cipher: unknown; iv: unknown; salt: string } =
        JSON.parse(encryptedString)

    const key = await nativeKeyFromPassword(password, encryptedData.salt)
    const data = await NativeModules.Aes.decrypt(
        encryptedData.cipher,
        key,
        encryptedData.iv,
        'AES'
    )

    return JSON.parse(data)
}

export const encodeAbiParameters = viemEncodeAbiParameters
