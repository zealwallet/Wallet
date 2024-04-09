import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { BoldImageCollection } from '@zeal/uikit/Icon/BoldImageCollection'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { format } from '@zeal/domains/Address/helpers/format'
import { NetworkMap } from '@zeal/domains/Network'
import { NftCollectionInfo } from '@zeal/domains/NFTCollection'
import { getCollectionExplorerLink } from '@zeal/domains/NFTCollection/helpers/getCollectionExplorerLink'
import { TransactionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { NFTBadge } from '@zeal/domains/SafetyCheck/components/NFTBadge'

type Props = {
    checks: TransactionSafetyCheck[]
    nftCollection: NftCollectionInfo
    networkMap: NetworkMap
}

export const NftCollectionListItem = ({
    nftCollection,
    networkMap,
    checks,
}: Props) => {
    const explorerLink = getCollectionExplorerLink(nftCollection, networkMap)

    return (
        <ListItem
            aria-current={false}
            size="large"
            avatar={({ size }) => (
                <Avatar
                    size={size}
                    variant="squared"
                    rightBadge={({ size }) => (
                        <NFTBadge
                            size={size}
                            nftCollectionInfo={nftCollection}
                            safetyChecks={checks}
                        />
                    )}
                >
                    <BoldImageCollection size={size} color="iconDefault" />
                </Avatar>
            )}
            primaryText={
                <Row spacing={4}>
                    <Text ellipsis>
                        {nftCollection.name || format(nftCollection.address)}
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
                <FormattedMessage
                    id="NftCollectionInfo.entireCollection"
                    defaultMessage="Entire collection"
                />
            }
        />
    )
}
