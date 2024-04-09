import { BadgeSize } from '@zeal/uikit/Avatar'
import { BoldShieldCautionWithBorder } from '@zeal/uikit/Icon/BoldShieldCautionWithBorder'
import { BoldShieldDoneWithBorder } from '@zeal/uikit/Icon/BoldShieldDoneWithBorder'

import { notReachable } from '@zeal/toolkit'

import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'

type Props = {
    safetyChecks: TransactionSafetyCheck[]
    nftCollectionInfo: NftCollectionInfo
    size: BadgeSize
}

export const NFTBadge = ({ nftCollectionInfo, safetyChecks, size }: Props) => {
    const check = safetyChecks.find((item) => {
        switch (item.type) {
            case 'NftCollectionCheck':
                return item.nftCollectionAddress === nftCollectionInfo.address

            case 'TokenVerificationCheck':
            case 'TransactionSimulationCheck':
            case 'SmartContractBlacklistCheck':
            case 'P2pReceiverTypeCheck':
            case 'ApprovalSpenderTypeCheck':
                return false

            /* istanbul ignore next */
            default:
                return notReachable(item)
        }
    })

    if (!check) {
        // We do not render badge if no match
        return null
    }

    switch (check.state) {
        case 'Failed':
            return (
                <BoldShieldCautionWithBorder
                    size={size}
                    color="statusWarning"
                />
            )

        case 'Passed':
            return (
                <BoldShieldDoneWithBorder size={size} color="statusSuccess" />
            )

        /* istanbul ignore next */
        default:
            return notReachable(check)
    }
}
