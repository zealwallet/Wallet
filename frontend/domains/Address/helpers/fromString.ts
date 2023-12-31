import { Address } from '@zeal/domains/Address'
import { failure, Result, success } from '@zeal/toolkit/Result'
import Web3 from 'web3'

export type ValidationError = {
    type: 'not_a_valid_address'
}

const REG_EXP = /^0x[a-fA-F0-9]{40}$/

const toChecksum = (address: string): Address => {
    const checksum = Web3.utils.toChecksumAddress(address)
    return checksum as Address

    // TODO :: this was based on this https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
    // but looks like CRA & createKeccakHash not really work together looks like createKeccakHash still think that it is node environment not browser
    // one way to fix it: https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined
    // but not sure we want to go this path

    // const sanitizeAddress = address.toLowerCase().replace('0x', '')
    // const hash = createKeccakHash('keccak256')
    //     .update(sanitizeAddress)
    //     .digest('hex')
    //
    // return sanitizeAddress.split('').reduce((res, char, currentIndex) => {
    //     const toAdd =
    //         parseInt(hash[currentIndex], 16) >= 8 ? char.toUpperCase() : char
    //     return `${res}${toAdd}`
    // }, '0x')
}

export const fromString = (
    address: string
): Result<ValidationError, Address> => {
    if (address.match(REG_EXP)) {
        return success(toChecksum(address))
    } else {
        return failure({
            type: 'not_a_valid_address',
        })
    }
}
