import { checksumAddress } from 'viem'

import { Address, ChecksumAddress } from '@zeal/domains/Address'

export const checksum = (address: Address): ChecksumAddress => {
    return checksumAddress(address as `0x${string}`) as ChecksumAddress
}
