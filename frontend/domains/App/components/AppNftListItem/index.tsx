import { Avatar } from '@zeal/uikit/Avatar'
import { Img } from '@zeal/uikit/Img'
import { ListItem } from '@zeal/uikit/ListItem'

import { AppNft } from '@zeal/domains/App'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'

type Props = {
    'aria-current': boolean
    nft: AppNft
    knownCurrencies: KnownCurrencies
}

export const AppNftListItem = ({
    'aria-current': ariaCurrent,
    nft,
    knownCurrencies,
}: Props) => {
    return (
        <ListItem
            size="large"
            aria-current={ariaCurrent}
            avatar={({ size }) =>
                nft.uri && (
                    <Avatar size={size}>
                        <Img size={size} src={nft.uri} />
                    </Avatar>
                )
            }
            primaryText={nft.name}
            side={{
                title: nft.priceInDefaultCurrency ? (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={nft.priceInDefaultCurrency}
                        knownCurrencies={knownCurrencies}
                    />
                ) : null,
            }}
        />
    )
}
