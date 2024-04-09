import { notReachable } from '@zeal/toolkit'

import { AppProtocol, AppToken } from '@zeal/domains/App'

export const tokensFromProtocol = (protocol: AppProtocol): AppToken[] => {
    switch (protocol.type) {
        case 'CommonAppProtocol':
            return [
                ...protocol.suppliedTokens,
                ...protocol.borrowedTokens,
                ...protocol.rewardTokens,
            ]

        case 'LockedTokenAppProtocol':
            return [...protocol.lockedTokens, ...protocol.rewardTokens]

        case 'LendingAppProtocol':
            return [
                ...protocol.suppliedTokens,
                ...protocol.borrowedTokens,
                ...protocol.rewardTokens,
            ]

        case 'VestingAppProtocol':
            return [protocol.vestedToken, protocol.claimableToken]

        case 'UnknownAppProtocol':
            return protocol.tokens

        default:
            return notReachable(protocol)
    }
}
