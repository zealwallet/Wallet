import { FormattedMessage } from 'react-intl'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { BoldImageCollection } from '@zeal/uikit/Icon/BoldImageCollection'
import { Document } from '@zeal/uikit/Icon/Document'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { format } from '@zeal/domains/Address/helpers/format'
import { FormattedNftAmount } from '@zeal/domains/Money/components/FormattedNftAmount'
import { NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'
import { ActivityTransaction } from '@zeal/domains/Transactions'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'

import { ApprovalTokenListItem } from './ApprovalTokenListItem'
import { MultiAssetList } from './MultiAssetList'
import { TokenListItem } from './TokenListItem'

type Props = {
    transaction: ActivityTransaction
    networkMap: NetworkMap
    displayLimit: boolean
}

export const AssetList = ({ transaction, networkMap, displayLimit }: Props) => {
    const network = findNetworkByHexChainId(
        transaction.networkHexId,
        networkMap
    )
    switch (transaction.type) {
        case 'SelfP2PActivityTransaction':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        >
                            <Document size={size} color="iconDefault" />
                        </UIAvatar>
                    )}
                    primaryText={
                        <FormattedMessage
                            id="activity.assets.no-balance-change"
                            defaultMessage="No balance change"
                        />
                    }
                />
            )

        case 'InboundP2PActivityTransaction':
        case 'UnknownActivityTransaction':
            return (
                <MultiAssetList
                    displayLimit={displayLimit}
                    tokens={transaction.tokens}
                    nfts={transaction.nfts}
                    network={network}
                    networkMap={networkMap}
                />
            )
        case 'OutboundP2PActivityTransaction':
            return (
                <TokenListItem
                    token={transaction.token}
                    networkMap={networkMap}
                />
            )
        case 'OutboundP2PNftActivityTransaction': {
            const { nft } = transaction.nft

            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={nft}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={nft.name || `#${BigInt(nft.tokenId)}`}
                    shortText={
                        nft.collectionInfo.name ||
                        format(nft.collectionInfo.address)
                    }
                    side={{
                        title: (
                            <>
                                {getSign(transaction.nft.direction)}
                                <FormattedNftAmount
                                    nft={nft}
                                    transferAmount={transaction.nft.amount}
                                />
                            </>
                        ),
                    }}
                />
            )
        }
        case 'SingleNftApprovalActivityTransaction':
        case 'SingleNftApprovalRevokeActivityTransaction':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={transaction.nft}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        transaction.nft.name ||
                        `#${BigInt(transaction.nft.tokenId)}`
                    }
                    shortText={
                        transaction.nft.collectionInfo.name ||
                        format(transaction.nft.collectionInfo.address)
                    }
                />
            )

        case 'NftCollectionApprovalActivityTransaction':
        case 'NftCollectionApprovalRevokeActivityTransaction':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        >
                            <BoldImageCollection
                                size={size}
                                color="iconDefault"
                            />
                        </UIAvatar>
                    )}
                    primaryText={
                        transaction.nftCollectionInfo.name ||
                        format(transaction.nftCollectionInfo.address)
                    }
                />
            )

        case 'Erc20ApprovalActivityTransaction':
        case 'Erc20ApprovalRevokeActivityTransaction':
            return (
                <ApprovalTokenListItem
                    approvalAmount={transaction.allowance}
                    networkMap={networkMap}
                />
            )

        case 'PartialTokenApprovalActivityTransaction':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar
                            size={size}
                            variant="squared"
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        >
                            <QuestionCircle size={size} color="iconDefault" />
                        </UIAvatar>
                    )}
                    primaryText={
                        <Text
                            variant="paragraph"
                            color="textDisabled"
                            weight="regular"
                        >
                            <FormattedMessage
                                id="transactions.asset_list.unkown_assets"
                                defaultMessage="Unknown"
                            />
                        </Text>
                    }
                />
            )

        case 'FailedActivityTransaction':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(transaction)
    }
}
