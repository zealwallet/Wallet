import { generateRandomBigint } from '@zeal/toolkit/Number'

import { Account } from '@zeal/domains/Account'
import { checksum } from '@zeal/domains/Address/helpers/checksum'
import { Network } from '@zeal/domains/Network'

type Params = {
    account: Account
    network: Network
}

export type UnblockSIWELoginRequest = {
    message: string
    network: Network
}

const ONE_HOUR_IN_MS = 60 * 60 * 1000
const MESSAGE_EXPIRY_TIME = 3 * ONE_HOUR_IN_MS
// https://grwth-lbs.sentry.io/issues/4504940861/?query=is%3Aunresolved&referrer=issue-stream&stream_index=11
const CREATED_AT_OFFSET_TO_COMPENSATE_FOR_USER_INCORRECT_TIME = ONE_HOUR_IN_MS

const UNBLOCK_DOMAIN = 'api.getunblock.com'

export const generateUnblockLoginRequest = ({
    account,
    network,
}: Params): UnblockSIWELoginRequest => {
    const issuedAt = new Date(
        Date.now() - CREATED_AT_OFFSET_TO_COMPENSATE_FOR_USER_INCORRECT_TIME
    ).toISOString()

    const message = `${UNBLOCK_DOMAIN} wants you to sign in with your Ethereum account:
${checksum(account.address)}

Sign in with Ethereum

URI: https://${UNBLOCK_DOMAIN}/auth/login
Version: 1
Chain ID: ${Number(network.hexChainId).toString(10)}
Nonce: ${generateRandomBigint(16).toString(16)}
Issued At: ${issuedAt}
Expiration Time: ${new Date(Date.now() + MESSAGE_EXPIRY_TIME).toISOString()}`

    return {
        network,
        message,
    }
}
