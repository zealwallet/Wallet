import { TextEncoder } from 'util'

global.TextEncoder = class TextEncoderMock extends TextEncoder {
    encode(input?: string | undefined): Uint8Array {
        return Uint8Array.from(super.encode(input))
    }
}

// Turn function's arguments which are Buffer to Uint8Array
const argsBufferToUint8Array =
    (fn: (...args: unknown[]) => unknown): ((...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
        fn(
            ...args.map((arg: unknown) =>
                Buffer.isBuffer(arg) ? Uint8Array.from(arg) : arg
            )
        )

const mock_secp256k1 = jest.requireActual('secp256k1')
const mock_crypto = jest.requireActual('crypto')
const mock_webcrypto = mock_crypto.webcrypto
const mock_nobleHashesUtils = jest.requireActual('@noble/hashes/utils')
const mock_nobleHashesAssert = jest.requireActual('@noble/hashes/_assert')
const mock_nobleCurvesAbstractUtils = jest.requireActual(
    '@noble/curves/abstract/utils'
)
const mock_EthCryptoNobleCurvesSrcAbstractUtils = jest.requireActual(
    'ethereum-cryptography/node_modules/@noble/curves/abstract/utils'
)

jest.mock('@noble/curves/abstract/utils', () => ({
    ...mock_nobleCurvesAbstractUtils,
    ensureBytes: argsBufferToUint8Array(
        mock_nobleCurvesAbstractUtils.ensureBytes
    ),
}))

// TODO @resetko-zeal Maybe this can be solved by custom jsdom env, which will guide those packages to use UIntp8Array instead of Buffer, so those hack won't be needed
jest.mock(
    'ethereum-cryptography/node_modules/@noble/curves/abstract/utils',
    () => ({
        ...mock_EthCryptoNobleCurvesSrcAbstractUtils,
        ensureBytes: argsBufferToUint8Array(
            mock_nobleCurvesAbstractUtils.ensureBytes
        ),
    })
)

jest.mock('@noble/hashes/utils', () => ({
    ...mock_nobleHashesUtils,
    wrapConstructor: (...args: unknown[]) => {
        const result = mock_nobleHashesUtils.wrapConstructor(...args)

        const customResult = argsBufferToUint8Array(result) as ((
            ...args: unknown[]
        ) => unknown) & {
            outputLen: unknown
            blockLen: unknown
            create: unknown
        }
        customResult.outputLen = result.outputLen
        customResult.blockLen = result.blockLen
        customResult.create = result.create

        return customResult
    },
}))

jest.mock('@noble/hashes/_assert', () => ({
    ...mock_nobleHashesAssert,
    bytes: argsBufferToUint8Array(mock_nobleHashesAssert.bytes),
}))

jest.mock('crypto', () => ({
    ...mock_crypto,
    randomBytes: mock_crypto.randomBytes.bind(mock_crypto),
    webcrypto: mock_webcrypto,
}))
jest.mock('expo-crypto', () => ({
    ...mock_crypto,
    randomBytes: mock_crypto.randomBytes.bind(mock_crypto),
    webcrypto: mock_webcrypto,
}))

jest.mock('secp256k1', () => ({
    privateKeyVerify: (buffer: Buffer) =>
        mock_secp256k1.privateKeyVerify(Uint8Array.from(buffer)),

    ecdsaSign: argsBufferToUint8Array(mock_secp256k1.ecdsaSign),
    publicKeyCreate: argsBufferToUint8Array(mock_secp256k1.publicKeyCreate),
    privateKeyTweakAdd: argsBufferToUint8Array(
        mock_secp256k1.privateKeyTweakAdd
    ),
}))

Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: mock_webcrypto.getRandomValues.bind(mock_webcrypto),
        randomUUID: mock_webcrypto.randomUUID.bind(mock_webcrypto),
        subtle: {
            importKey: mock_webcrypto.subtle.importKey.bind(
                mock_webcrypto.subtle
            ),
            deriveKey: mock_webcrypto.subtle.deriveKey.bind(
                mock_webcrypto.subtle
            ),
            encrypt: mock_webcrypto.subtle.encrypt.bind(mock_webcrypto.subtle),
            decrypt: mock_webcrypto.subtle.decrypt.bind(mock_webcrypto.subtle),
        },
    },
})
