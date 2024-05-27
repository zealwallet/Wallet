import { get } from '@zeal/api/gnosisApi'

import { string } from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { checksum } from '@zeal/domains/Address/helpers/checksum'

const CREATED_AT_OFFSET_TO_COMPENSATE_FOR_USER_INCORRECT_TIME = 10 * 60 * 1000

export const getLoginMessage = async ({
    address,
}: {
    address: Address
}): Promise<string> => {
    const issuedAt = new Date(
        Date.now() - CREATED_AT_OFFSET_TO_COMPENSATE_FOR_USER_INCORRECT_TIME
    ).toISOString()
    const nonce = string(await get('/auth/nonce', {})).getSuccessResultOrThrow(
        'Failed to parse nonce'
    )

    return [
        `app.gnosispay.com wants you to sign in with your Ethereum account:`,
        `${checksum(address)}`,
        ``,
        `Sign in With Ethereum.`,
        ``,
        `URI: https://app.gnosispay.com`,
        `Version: 1`,
        `Chain ID: 100`,
        `Nonce: ${nonce}`,
        `Issued At: ${issuedAt}`,
    ].join('\n')
}
