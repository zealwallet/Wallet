import { failure, Result, success } from '@zeal/toolkit/Result'

import { WalletConnectPairingLink } from '..'

const PAIRING_DEEP_LINK_REGEXP =
    /^[a-z]+:\/\/walletconnect\/wc\?uri=(.+)|(wc:.+symKey.+)$/i

export const parsePairingLink = (
    input: string
): Result<unknown, WalletConnectPairingLink> => {
    const customSchemeMatch = input.match(PAIRING_DEEP_LINK_REGEXP)?.[1]
    const wcSchemeMatch = input.match(PAIRING_DEEP_LINK_REGEXP)?.[2]

    try {
        if (customSchemeMatch) {
            return success({
                type: 'wallet_connect_pairing_link',
                uri: decodeURIComponent(customSchemeMatch),
            })
        } else if (wcSchemeMatch) {
            return success({
                type: 'wallet_connect_pairing_link',
                uri: wcSchemeMatch,
            })
        } else {
            return failure({
                type: 'value_is_not_a_wallet_connect_deep_link_url' as const,
                value: input,
            })
        }
    } catch (e) {
        return failure({ type: 'failed_to_parse_link', error: e })
    }
}
