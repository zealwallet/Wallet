import Big from 'big.js'

export const amountToBigint = (
    amount: string | null,
    fraction: number
): bigint => {
    const value = amount?.replace(/[^\d.]/gim, '') || '0' // We remove everything which is not digit or dot so Big can parse it
    return BigInt(Big(value).mul(Big(10).pow(fraction)).toFixed(0))
}
