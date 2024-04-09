import { failure, Result, success } from '../Result'

export type Hexadecimal = `0x${string}`

export const remove0x = (str: string): string => str.replace(/^0x/i, '')

const padToEven = (hex: string): string =>
    hex.padStart(hex.length + (hex.length % 2), '0')

const normalize = (hex: string): string =>
    padToEven(remove0x(hex).toLowerCase())

const HEXADECIMAL_REGEXP = /^(0x)?[0-9a-fA-F]+$/gi

export type StringValueNotHexadecimal = {
    type: 'string_value_is_not_hexadecimal'
    value: unknown
}

export const parseFromString = (
    str: string
): Result<StringValueNotHexadecimal, Hexadecimal> => {
    const matches = str.trim().match(HEXADECIMAL_REGEXP)
    const normalized = normalize(str)

    return matches
        ? success(`0x${normalized}` as const)
        : failure({
              type: 'string_value_is_not_hexadecimal',
              value: str,
          })
}

export const concat = (...hexes: Hexadecimal[]): Hexadecimal =>
    `0x${hexes.map(remove0x).join('')}`

export const fromBuffer = (buffer: ArrayBuffer): Hexadecimal => {
    const hexes = Array.from(new Uint8Array(buffer))
        .map((item) => item.toString(16).padStart(2, '0'))
        .join('')

    return `0x${hexes}`
}

export const fromBigInt = (value: bigint): Hexadecimal =>
    `0x${normalize(value.toString(16))}`
