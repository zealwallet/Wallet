import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { NetworkMap } from '@zeal/domains/Network'
import { NftListItem } from '@zeal/domains/NFTCollection/components/NftListItem'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { TransactionNft } from '@zeal/domains/Transactions'

type Props = {
    checks: TransactionSafetyCheck[]
    transactionNft: TransactionNft
    networkMap: NetworkMap
}

const DirectionNode = ({
    direction,
}: {
    direction: TransactionNft['direction']
}) => {
    switch (direction) {
        case 'Send':
            return (
                <Text variant="paragraph" weight="regular" color="textPrimary">
                    -1
                </Text>
            )

        case 'Receive':
            return (
                <Text variant="paragraph" weight="regular" color="textPrimary">
                    +1
                </Text>
            )

        /* istanbul ignore next */
        default:
            return notReachable(direction)
    }
}

export const Nft = ({ transactionNft, checks, networkMap }: Props) => (
    <NftListItem
        networkMap={networkMap}
        checks={checks}
        nft={transactionNft.nft}
        rightNode={<DirectionNode direction={transactionNft.direction} />}
    />
)
