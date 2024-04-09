import { Card } from '@zeal/uikit/Card'
import { Clickable } from '@zeal/uikit/Clickable'

import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { PortfolioNFT } from '@zeal/domains/NFTCollection'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'

type Props = {
    nft: PortfolioNFT
    currencies: KnownCurrencies
    onClick: () => void
}

export const ListItemWithInfo = ({ nft, currencies, onClick }: Props) => {
    return (
        <Clickable onClick={onClick}>
            <Card
                imageWidth={146}
                image={<NftAvatar nft={nft} size={146} variant="square" />}
                title={`#${nft.tokenId}`}
                subtitle={
                    <FormattedTokenBalanceInDefaultCurrency
                        money={nft.priceInDefaultCurrency}
                        knownCurrencies={currencies}
                    />
                }
            />
        </Clickable>
    )
}
