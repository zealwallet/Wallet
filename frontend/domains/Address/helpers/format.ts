import { Address } from '@zeal/domains/Address'

const START = 6
const END = 4

export const format = (address: Address): string => {
    const start = address.substring(0, START)
    const end = address.substring(address.length - END)
    return `${start}...${end}`
}
