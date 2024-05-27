import memoize from 'lodash.memoize'

import { failure, Result, success } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'

export type ValidationError = {
    type: 'not_a_valid_address'
}

const REG_EXP = /^0x[a-fA-F0-9]{40}$/

export const ADDRESS_STRING_LEGTH_WITHOUT_PREFIX = 40

export const fromString = memoize(
    (address: string): Result<ValidationError, Address> => {
        if (address.match(REG_EXP)) {
            return success(address.toLowerCase()) // we should not checksum address in parsers as it is expensive
        } else {
            return failure({
                type: 'not_a_valid_address',
            })
        }
    }
)

export const fromBigint = (
    bigint: bigint
): Result<ValidationError, Address> => {
    const address = `0x${bigint
        .toString(16)
        .padStart(ADDRESS_STRING_LEGTH_WITHOUT_PREFIX, '0')}`

    return fromString(address)
}
