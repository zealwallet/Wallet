import { getRandomIntArray } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'

export const generateRandomNumber = (): number => {
    const array = new Uint32Array(1)
    getRandomIntArray(array)
    return array[0]
}

export const generateRandomBigint = (nBytes: number): bigint => {
    const array = new Uint8Array(nBytes)
    getRandomIntArray(array)
    return BigInt(Hexadecimal.fromBuffer(array))
}

export const toHex = (n: bigint | number | string) => {
    if (typeof n === 'string' && n.endsWith('.')) {
        n = n.slice(0, -1)
    }

    return '0x' + BigInt(n).toString(16)
}
