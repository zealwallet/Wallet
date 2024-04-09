import React from 'react'

import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { format } from '@zeal/domains/Address/helpers/format'
import { NetworkMap } from '@zeal/domains/Network'
import { Nft } from '@zeal/domains/NFTCollection'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'
import { getExplorerLink } from '@zeal/domains/NFTCollection/helpers/getExplorerLink'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { NFTBadge } from '@zeal/domains/SafetyCheck/components/NFTBadge'

type Props = {
    nft: Nft
    checks: TransactionSafetyCheck[]
    rightNode: React.ReactNode
    networkMap: NetworkMap
}

export const NftListItem = ({ nft, rightNode, networkMap, checks }: Props) => {
    const explorerLink = getExplorerLink(nft, networkMap)

    return (
        <ListItem
            aria-current={false}
            avatar={({ size }) => (
                <NftAvatar
                    size={size}
                    nft={nft}
                    rightBadge={({ size }) => (
                        <NFTBadge
                            size={size}
                            nftCollectionInfo={nft.collectionInfo}
                            safetyChecks={checks}
                        />
                    )}
                />
            )}
            primaryText={
                <Row spacing={4}>
                    <Text ellipsis>
                        {nft.name || `#${BigInt(nft.tokenId)}`}
                    </Text>

                    {!explorerLink ? null : (
                        <IconButton
                            variant="on_light"
                            onClick={() => openExternalURL(explorerLink)}
                        >
                            {({ color }) => (
                                <ExternalLink size={14} color={color} />
                            )}
                        </IconButton>
                    )}
                </Row>
            }
            shortText={
                nft.collectionInfo.name || format(nft.collectionInfo.address)
            }
            size="large"
            side={{
                title: rightNode,
            }}
        />
    )
}
