import { FormattedMessage } from 'react-intl'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { Column } from '@zeal/uikit/Column'
import { Divider } from '@zeal/uikit/Divider'
import { Document } from '@zeal/uikit/Icon/Document'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { format } from '@zeal/domains/Address/helpers/format'
import { FormattedNftAmount } from '@zeal/domains/Money/components/FormattedNftAmount'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'
import { TransactionNft, TransactionToken } from '@zeal/domains/Transactions'
import { getSign } from '@zeal/domains/Transactions/helpers/getSign'

import { TokenListItem } from './TokenListItem'

type Props = {
    tokens: TransactionToken[]
    nfts: TransactionNft[]
    network: Network
    networkMap: NetworkMap
    displayLimit: boolean
}

const MAX_DISPLAY_LIMIT = 4

const group = (
    tokens: TransactionToken[],
    nfts: TransactionNft[]
): Record<
    'incoming' | 'outgoing',
    Array<TransactionToken | TransactionNft>
> => {
    return [...tokens, ...nfts].reduce(
        (record, asset) => {
            switch (asset.direction) {
                case 'Send':
                    record.outgoing.push(asset)
                    return record
                case 'Receive':
                    record.incoming.push(asset)
                    return record

                /* istanbul ignore next */
                default:
                    return notReachable(asset.direction)
            }
        },
        { incoming: [], outgoing: [] } as Record<
            'incoming' | 'outgoing',
            Array<TransactionToken | TransactionNft>
        >
    )
}

export const MultiAssetList = ({
    tokens,
    nfts,
    network,
    networkMap,
    displayLimit,
}: Props) => {
    const { incoming, outgoing } = group(tokens, nfts)

    const incomingSliced = incoming.slice(
        0,
        displayLimit ? MAX_DISPLAY_LIMIT / 2 : incoming.length
    )

    const outgoingSliced = outgoing.slice(
        0,
        displayLimit ? MAX_DISPLAY_LIMIT / 2 : outgoing.length
    )

    const remaining =
        tokens.length +
        nfts.length -
        incomingSliced.length -
        outgoingSliced.length

    if (tokens.length + nfts.length === 0) {
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
    }

    return (
        <>
            {incomingSliced.map((asset, idx) => (
                <Item
                    key={`incoming-${idx}-${asset.type}`}
                    asset={asset}
                    network={network}
                    networkMap={networkMap}
                />
            ))}
            {outgoingSliced.map((asset, idx) => (
                <Item
                    key={`outgoing-${idx}-${asset.type}`}
                    asset={asset}
                    network={network}
                    networkMap={networkMap}
                />
            ))}
            {!!remaining && <Footer numTokens={remaining} />}
        </>
    )
}

const Item = ({
    asset,
    network,
    networkMap,
}: {
    asset: TransactionToken | TransactionNft
    network: Network
    networkMap: NetworkMap
}) => {
    switch (asset.type) {
        case 'transaction_token':
            return <TokenListItem token={asset} networkMap={networkMap} />
        case 'transaction_nft':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <NftAvatar
                            size={size}
                            nft={asset.nft}
                            rightBadge={({ size }) => (
                                <Badge size={size} network={network} />
                            )}
                        />
                    )}
                    primaryText={
                        asset.nft.name || `#${BigInt(asset.nft.tokenId)}`
                    }
                    shortText={
                        asset.nft.collectionInfo.name ||
                        format(asset.nft.collectionInfo.address)
                    }
                    side={{
                        title: (
                            <>
                                {getSign(asset.direction)}
                                <FormattedNftAmount
                                    nft={asset.nft}
                                    transferAmount={asset.amount}
                                />
                            </>
                        ),
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(asset)
    }
}

const Footer = ({ numTokens }: { numTokens: number }) => (
    <Column spacing={8}>
        <Divider variant="secondary" />
        <Row spacing={4} alignX="end">
            <Text variant="caption1" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="activity.more-tokens.label"
                    defaultMessage="+{numTokens} more token(s)"
                    values={{ numTokens }}
                />
            </Text>
            <LightArrowRight2 size={14} color="iconDefault" />
        </Row>
    </Column>
)
