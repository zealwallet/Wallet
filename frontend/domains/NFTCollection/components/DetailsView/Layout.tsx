import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Card } from '@zeal/uikit/Card'
import { Column } from '@zeal/uikit/Column'
import { AddressBook } from '@zeal/uikit/Icon/AddressBook'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { Opensea } from '@zeal/uikit/Icon/Opensea'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { NftAvatar } from '@zeal/domains/NFTCollection/components/NftAvatar'
import { getNFTImageSource } from '@zeal/domains/NFTCollection/helpers/getNFTImageSource'
import { getOpenSeeLink } from '@zeal/domains/NFTCollection/helpers/getOpenSeeLink'

type Props = {
    nft: PortfolioNFT
    nftCollection: PortfolioNFTCollection
    account: Account
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_info_button_click' }
    | { type: 'on_change_account_icon_click'; src: string }
    | {
          type: 'on_send_nft_click'
          nft: PortfolioNFT
          collection: PortfolioNFTCollection
          fromAddress: Address
      }

export const Layout = ({
    onMsg,
    nft,
    nftCollection,
    account,
    knownCurrencies,
    networkMap,
}: Props) => {
    return (
        <Screen
            padding="form"
            background="default"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16} alignX="center" fill>
                <Text
                    ellipsis
                    variant="caption1"
                    weight="semi_bold"
                    color="textSecondary"
                >
                    {nftCollection.name}
                </Text>

                <Row spacing={6}>
                    <Text
                        ellipsis
                        variant="title3"
                        weight="semi_bold"
                        color="textPrimary"
                    >
                        #{nft.tokenId}
                    </Text>
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            openExternalURL(
                                getOpenSeeLink(nftCollection, nft, networkMap)
                            )
                        }}
                    >
                        {({ color }) => <Opensea size={24} color={color} />}
                    </IconButton>
                </Row>

                <Column spacing={24} alignX="center">
                    <Card
                        imageWidth={320}
                        image={
                            <NftAvatar nft={nft} size={320} variant="square" />
                        }
                        rightTop={
                            <ChangeProfilePicture nft={nft} onMsg={onMsg} />
                        }
                    />

                    <Row alignX="center" alignY="center" spacing={8}>
                        <Text
                            variant="title1"
                            weight="semi_bold"
                            color="textPrimary"
                        >
                            <FormattedTokenBalanceInDefaultCurrency
                                money={nft.priceInDefaultCurrency}
                                knownCurrencies={knownCurrencies}
                            />
                        </Text>
                        <IconButton
                            variant="on_light"
                            onClick={() => {
                                onMsg({ type: 'on_info_button_click' })
                            }}
                        >
                            {({ color }) => (
                                <InfoCircle size={18} color={color} />
                            )}
                        </IconButton>
                    </Row>
                </Column>

                <Spacer />

                <Column spacing={16}>
                    <Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({
                                    type: 'on_send_nft_click',
                                    nft,
                                    collection: nftCollection,
                                    fromAddress: account.address,
                                })
                            }}
                        >
                            <FormattedMessage
                                id="action.send"
                                defaultMessage="Send"
                            />
                        </Button>
                    </Actions>
                </Column>
            </Column>
        </Screen>
    )
}

const ChangeProfilePicture = ({
    nft,
    onMsg,
}: {
    nft: PortfolioNFT
    onMsg: (msg: Msg) => void
}) => {
    const src = getNFTImageSource(nft)
    switch (src.type) {
        case 'web':
        case 'ipfs':
            return (
                <Column spacing={0}>
                    <Row spacing={0} alignX="end">
                        <IconButton
                            variant="on_light"
                            onClick={() => {
                                onMsg({
                                    type: 'on_change_account_icon_click',
                                    src: src.uri,
                                })
                            }}
                        >
                            {({ color }) => (
                                <AddressBook size={28} color={color} />
                            )}
                        </IconButton>
                    </Row>
                </Column>
            )
        case 'unknown':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(src)
    }
}
