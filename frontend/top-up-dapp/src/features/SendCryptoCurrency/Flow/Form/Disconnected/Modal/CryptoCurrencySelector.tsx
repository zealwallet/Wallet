import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Text } from '@zeal/uikit/Text'

import { CryptoCurrency } from '@zeal/domains/Currency'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { ImperativeError } from '@zeal/domains/Error'
import { Badge } from '@zeal/domains/Network/components/Badge'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'

type Props = {
    topUpCurrencies: CryptoCurrency[]
    selectedCurrency: CryptoCurrency
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_crypto_currency_selected'; currency: CryptoCurrency }

export const CryptoCurrencySelector = ({
    selectedCurrency,
    topUpCurrencies,
    onMsg,
}: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                                id="choose-tokens-label"
                            >
                                <FormattedMessage
                                    id="top-up.choose-tokens-label"
                                    defaultMessage="Tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />
            <SectionList
                variant="grouped"
                sections={[{ data: topUpCurrencies }]}
                sectionSpacing={8}
                itemSpacing={8}
                renderItem={({ item: currency }) => (
                    <ListItem
                        currency={currency}
                        selected={currency.id === selectedCurrency.id}
                        onClick={() =>
                            onMsg({
                                type: 'on_crypto_currency_selected',
                                currency,
                            })
                        }
                    />
                )}
            />
        </Screen>
    )
}

const ListItem = ({
    currency,
    onClick,
    selected,
}: {
    currency: CryptoCurrency
    selected: boolean
    onClick: () => void
}) => {
    const network = PREDEFINED_NETWORKS.find(
        (network) => network.hexChainId === currency.networkHexChainId
    )

    if (!network) {
        throw new ImperativeError(
            `Network ${currency.networkHexChainId} not found in disconnected currency selector`
        )
    }

    return (
        <UIListItem
            onClick={onClick}
            key={currency.id}
            avatar={({ size }) => (
                <Avatar
                    currency={currency}
                    size={size}
                    rightBadge={({ size }) => (
                        <Badge network={network} size={size} />
                    )}
                />
            )}
            aria-current={selected}
            size="large"
            primaryText={currency.code}
        />
    )
}
