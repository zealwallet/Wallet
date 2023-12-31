import { FormattedMessage } from 'react-intl'
import { KnownCurrencies } from '@zeal/domains/Currency'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Group, Section } from 'src/uikit/Group'
import { NFT } from 'src/uikit/Icon/Empty/NFT'
import { Row } from '@zeal/uikit/Row'
import { GroupHeader } from '../GroupHeader'
import { ListItem } from '../ListItem'

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
        <Section style={{ flex: '0 0 auto' }}>
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
            <Group style={{ flex: '0 0 auto' }} variant="default">
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
                                        <ListItem
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_nft_click',
                                                    nftCollection: collection,
                                                    nft,
                                                })
                                            }}
                                            size={92}
                                            nft={nft}
                                        />
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
