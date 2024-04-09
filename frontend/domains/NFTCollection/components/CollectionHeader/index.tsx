import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { format } from '@zeal/domains/Address/helpers/format'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import { Avatar } from '@zeal/domains/Network/components/Avatar'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { PortfolioNFTCollection } from '@zeal/domains/NFTCollection'

export const CollectionHeader = ({
    nftCollection,
    currencies,
    networkMap,
}: {
    nftCollection: PortfolioNFTCollection
    currencies: KnownCurrencies
    networkMap: NetworkMap
}) => {
    return (
        <Column spacing={4}>
            <Row spacing={4}>
                <Text
                    variant="paragraph"
                    weight="regular"
                    color="textPrimary"
                    ellipsis
                >
                    {nftCollection.name}
                </Text>

                <Row spacing={0}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        ({nftCollection.nfts.length})
                    </Text>
                </Row>

                <Spacer />

                <Row spacing={0}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedTokenBalanceInDefaultCurrency
                            money={nftCollection.priceInDefaultCurrency}
                            knownCurrencies={currencies}
                        />
                    </Text>
                </Row>
            </Row>

            <Row spacing={3}>
                <Avatar
                    currentNetwork={{
                        type: 'specific_network',
                        network: findNetworkByHexChainId(
                            nftCollection.networkHexId,
                            networkMap
                        ),
                    }}
                    size={14}
                />
                <Text variant="caption1" weight="regular" color="textSecondary">
                    {format(nftCollection.mintAddress)}
                </Text>
            </Row>
        </Column>
    )
}
