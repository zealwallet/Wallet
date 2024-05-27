import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { NFT } from '@zeal/uikit/Icon/Empty'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Text } from '@zeal/uikit/Text'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBarAccountSelector } from '@zeal/domains/Account/components/ActionBarAccountSelector'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { NetworkSelector } from '@zeal/domains/Network/components/NetworkSelector'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { ListItemWithInfo } from '@zeal/domains/NFTCollection/components/ListItemWithInfo'
import { Portfolio } from '@zeal/domains/Portfolio'

import { CollectionHeader } from '../CollectionHeader'

type Props = {
    nftCollections: PortfolioNFTCollection[]
    account: Account
    currincies: KnownCurrencies
    selectedNetwork: CurrentNetwork
    portfolio: Portfolio
    keystore: KeyStore
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_nft_click'
          nft: PortfolioNFT
          nftCollection: PortfolioNFTCollection
      }
    | { type: 'network_filter_click' }
    | MsgOf<typeof ActionBarAccountSelector>

export const Layout = ({
    nftCollections,
    account,
    selectedNetwork,
    portfolio,
    currincies,
    keystore,
    networkMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                top={
                    <ActionBarAccountSelector account={account} onMsg={onMsg} />
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4} shrink>
                            <BackIcon size={24} color="iconDefault" />

                            <Text
                                variant="title3"
                                weight="medium"
                                color="textPrimary"
                            >
                                <FormattedMessage
                                    id="action_bar_title.nfts"
                                    defaultMessage="NFTs"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
                right={
                    <NetworkSelector
                        variant="on_light"
                        size={24}
                        currentNetwork={selectedNetwork}
                        onClick={() => {
                            onMsg({ type: 'network_filter_click' })
                        }}
                    />
                }
            />

            <ScrollContainer>
                <Column spacing={30}>
                    {nftCollections.length === 0 ? (
                        <EmptyStateWidget
                            size="regular"
                            icon={({ size }) => (
                                <NFT size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="nft.widget.emptystate"
                                    defaultMessage="We found no NFTs"
                                />
                            }
                        />
                    ) : (
                        nftCollections.map((collection) => {
                            return (
                                <Column
                                    key={collection.mintAddress}
                                    spacing={12}
                                >
                                    <CollectionHeader
                                        networkMap={networkMap}
                                        nftCollection={collection}
                                        currencies={currincies}
                                    />
                                    <Row spacing={16} wrap wrapSpacing={8}>
                                        {collection.nfts.map((nft) => (
                                            <ListItemWithInfo
                                                key={`${nft.tokenId}`}
                                                nft={nft}
                                                currencies={currincies}
                                                onClick={() =>
                                                    onMsg({
                                                        type: 'on_nft_click',
                                                        nft,
                                                        nftCollection:
                                                            collection,
                                                    })
                                                }
                                            />
                                        ))}
                                    </Row>
                                </Column>
                            )
                        })
                    )}
                </Column>
            </ScrollContainer>
        </Screen>
    )
}
