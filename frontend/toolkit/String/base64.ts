export const base64Encode = (input: Uint8Array): string =>
    Buffer.from(input).toString('base64')

export const base64Decode = (input: string): Uint8Array =>
    Uint8Array.from(Buffer.from(input, 'base64'))

export const base64UrlEncode = (base64Value: string): string =>
    base64Value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
