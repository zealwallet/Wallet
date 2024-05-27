import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group, Section } from '@zeal/uikit/Group'
import { Tokens } from '@zeal/uikit/Icon/Empty'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'

import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Token } from '@zeal/domains/Token'
import { ListItem as TokenListItem } from '@zeal/domains/Token/components/ListItem'
import { filterByHideMap } from '@zeal/domains/Token/helpers/filterByHideMap'

import { TokensGroupHeader } from '../TokensGroupHeader'

type Props = {
    tokens: Token[]
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'show_all_tokens_click' }
    | { type: 'on_token_click'; token: Token }
    | { type: 'on_add_funds_click' }

const NUM_OF_ELEMENTS = 3

export const Widget = ({
    tokens,
    knownCurrencies,
    networkMap,
    currentNetwork,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [labelId] = useState(uuid())
    const filteredTokens = tokens.filter(filterByHideMap(currencyHiddenMap))
    return (
        <Section aria-labelledby={labelId}>
            <Group variant="widget">
                <TokensGroupHeader
                    labelId={labelId}
                    onClick={
                        filteredTokens.length
                            ? () => onMsg({ type: 'show_all_tokens_click' })
                            : null
                    }
                    tokens={filteredTokens}
                    knownCurrencies={knownCurrencies}
                />
                {filteredTokens.length ? (
                    filteredTokens.slice(0, NUM_OF_ELEMENTS).map((token) => (
                        <TokenListItem
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            networkMap={networkMap}
                            aria-current={false}
                            onClick={() => {
                                onMsg({
                                    type: 'on_token_click',
                                    token,
                                })
                            }}
                            key={token.balance.currencyId + token.networkHexId}
                            knownCurrencies={knownCurrencies}
                            token={token}
                        />
                    ))
                ) : (
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <Tokens size={size} color="backgroundLight" />
                        )}
                        title={
                            <FormattedMessage
                                id="token.widget.emptyState"
                                defaultMessage="We found no tokens"
                            />
                        }
                        action={(() => {
                            switch (currentNetwork.type) {
                                case 'all_networks':
                                    return (
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_add_funds_click',
                                                })
                                            }
                                        >
                                            <FormattedMessage
                                                id="token.widget.addFunds"
                                                defaultMessage="Add funds"
                                            />
                                        </Button>
                                    )
                                case 'specific_network':
                                    return null

                                default:
                                    notReachable(currentNetwork)
                            }
                        })()}
                    />
                )}
            </Group>
        </Section>
    )
}
