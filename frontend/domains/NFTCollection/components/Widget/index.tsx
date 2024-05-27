import { FormattedMessage } from 'react-intl'

import { Clickable } from '@zeal/uikit/Clickable'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, Section } from '@zeal/uikit/Group'
import { NFT } from '@zeal/uikit/Icon/Empty/NFT'
import { Row } from '@zeal/uikit/Row'

import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'

import { GroupHeader } from '../GroupHeader'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    currencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'show_all_nft_click' }
    | {
          type: 'on_nft_click'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }

const NUM_OF_ELEMENTS = 3

export const Widget = ({ nftCollections, currencies, onMsg }: Props) => {
    return (
        <Section>
            <Group variant="widget">
                <GroupHeader
                    onClick={
                        nftCollections.length
                            ? () => {
                                  onMsg({ type: 'show_all_nft_click' })
                              }
                            : null
                    }
                    knownCurrencies={currencies}
                    nftCollections={nftCollections}
                />
                {nftCollections.length ? (
                    <>
                        <Row spacing={4} wrap wrapSpacing={4}>
                            {nftCollections
                                .flatMap((collection) =>
                                    collection.nfts.map(
                                        (nft) => [collection, nft] as const
                                    )
                                )
                                .slice(0, NUM_OF_ELEMENTS)
                                .map(([collection, nft]) => (
                                    <Row key={nft.tokenId} spacing={0}>
                                        <Clickable
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_nft_click',
                                                    nftCollection: collection,
                                                    nft,
                                                })
                                            }}
                                        >
                                            <NftAvatar nft={nft} size={92} />
                                        </Clickable>
                                    </Row>
                                ))}
                        </Row>
                    </>
                ) : (
                    <NFTEmptyState />
                )}
            </Group>
        </Section>
    )
}

const NFTEmptyState = () => {
    return (
        <EmptyStateWidget
            size="regular"
            icon={({ size }) => <NFT size={size} color="backgroundLight" />}
            title={
                <FormattedMessage
                    id="nft.widget.emptystate"
                    defaultMessage="We found no NFTs"
                />
            }
        />
    )
}
