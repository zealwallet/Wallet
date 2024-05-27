import { Buffer } from 'buffer'

export const encryptRSAOAEP = async (
    dataBase64: string,
    publicKeyBase64: string
): Promise<string> => {
    const keyBuffer = Buffer.from(publicKeyBase64, 'base64')

    const key = await globalThis.crypto.subtle.importKey(
        'spki',
        keyBuffer,
        { name: 'RSA-OAEP', hash: { name: 'SHA-1' } },
        true,
        ['encrypt']
    )

    const encodedData = Buffer.from(dataBase64, 'utf8')

    const encryptedBuffer = Buffer.from(
        await globalThis.crypto.subtle.encrypt(
            { name: 'RSA-OAEP' },
            key,
            encodedData
        )
    )

    return encryptedBuffer.toString('base64')
}

export const decryptAESGCM = async (
    cipherBase64: string,
    keyBase64: string,
    ivBase64: string
): Promise<string> => {
    const cipherBuffer = Buffer.from(cipherBase64, 'base64')
    const ivBuffer = Buffer.from(ivBase64, 'base64')
    const keyBuffer = Buffer.from(keyBase64, 'base64')

    const key = await globalThis.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
    )

    const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBuffer },
        key,
        cipherBuffer
    )

    return Buffer.from(decryptedBuffer).toString('utf8')
}
