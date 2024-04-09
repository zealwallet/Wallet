import { TransactionHash } from '../TransactionHash'

const START = 2
const END = 2

export const format = (hash: TransactionHash): string => {
    const hashUpper = hash.transactionHash.toUpperCase().replace(/^0x/i, '')
    const start = hashUpper.substring(0, START)
    const end = hashUpper.substring(hashUpper.length - END)
    return `0x${start}...${end}`
}
