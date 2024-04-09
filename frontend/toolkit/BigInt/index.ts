/**
 * @deprecated use Hexadecimal.fromBigInt instead
 */
export const bigIntToHex = (value: bigint): string => `0x${value.toString(16)}`
