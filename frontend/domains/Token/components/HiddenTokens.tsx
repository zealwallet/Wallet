import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDelete } from '@zeal/uikit/Icon/BoldDelete'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Text } from '@zeal/uikit/Text'

import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { Token } from '@zeal/domains/Token'
import { ListItem } from '@zeal/domains/Token/components/ListItem'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

type Props = {
    portfolio: Portfolio
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'on_token_click'; token: Token }

export const HiddenTokens = ({
    currencyHiddenMap,
    networkMap,
    currencyPinMap,
    portfolio,
    onMsg,
}: Props) => {
    const filterNonHidden = filterByHideMap(currencyHiddenMap)
    const tokens = portfolio.tokens.filter((token) => !filterNonHidden(token))

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
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
                                    id="token.hidden_tokens.page.title"
                                    defaultMessage="Hidden tokens"
                                />
                            </Text>
                        </Row>
                    </Clickable>
                }
            />
            <Column spacing={12} shrink>
                {!!tokens.length ? (
                    <ScrollContainer>
                        <Group variant="default">
                            {tokens.map((token) => {
                                return (
                                    <ListItem
                                        key={token.balance.currencyId}
                                        token={token}
                                        aria-current={false}
                                        knownCurrencies={portfolio.currencies}
                                        networkMap={networkMap}
                                        currencyHiddenMap={currencyHiddenMap}
                                        currencyPinMap={currencyPinMap}
                                        onClick={() => {
                                            onMsg({
                                                type: 'on_token_click',
                                                token,
                                            })
                                        }}
                                    />
                                )
                            })}
                        </Group>
                    </ScrollContainer>
                ) : (
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <BoldDelete size={size} color="iconDefault" />
                        )}
                        title={
                            <FormattedMessage
                                id="hidden_tokens.widget.emptyState"
                                defaultMessage="We found no hidden tokens"
                            />
                        }
                    />
                )}
            </Column>
        </Screen>
    )
}
