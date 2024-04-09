import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
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
import { CustomNetwork, NetworkMap, TestNetwork } from '@zeal/domains/Network'
import { Token } from '@zeal/domains/Token'
import { ListItem as TokenListItem } from '@zeal/domains/Token/components/ListItem'
import { TokensGroupHeader } from '@zeal/domains/Token/components/TokensGroupHeader'

import { LastRefreshed } from '../LastRefreshed'
import { TopupTestNetworkNotification } from '../TopupTestNetworkNotification'

type Props = {
    network: TestNetwork | CustomNetwork
    tokens: Token[]
    fetchedAt: Date
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_add_custom_currency_click' }
    | { type: 'show_all_tokens_click' }
    | { type: 'reload_button_click' }
    | { type: 'on_token_click'; token: Token }

const NUM_OF_ELEMENTS = 3

export const Layout = ({
    network,
    tokens,
    knownCurrencies,
    networkMap,
    fetchedAt,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
}: Props) => {
    const [tokensLabelId] = useState(uuid())
    return (
        <Column spacing={16}>
            {(() => {
                switch (network.type) {
                    case 'testnet':
                        return (
                            <TopupTestNetworkNotification
                                testNetwork={network}
                            />
                        )
                    case 'custom':
                        return null
                    /* istanbul ignore next */
                    default:
                        return notReachable(network)
                }
            })()}

            <Section aria-labelledby={tokensLabelId}>
                <TokensGroupHeader
                    labelId={tokensLabelId}
                    onClick={
                        tokens.length
                            ? () => onMsg({ type: 'show_all_tokens_click' })
                            : null
                    }
                    tokens={tokens}
                    knownCurrencies={knownCurrencies}
                />
                <Group variant="default">
                    {tokens.length ? (
                        tokens.slice(0, NUM_OF_ELEMENTS).map((token) => (
                            <TokenListItem
                                currencyHiddenMap={currencyHiddenMap}
                                currencyPinMap={currencyPinMap}
                                aria-current={false}
                                networkMap={networkMap}
                                onClick={() => {
                                    onMsg({
                                        type: 'on_token_click',
                                        token,
                                    })
                                }}
                                key={
                                    token.balance.currencyId +
                                    token.networkHexId
                                }
                                knownCurrencies={knownCurrencies}
                                token={token}
                            />
                        ))
                    ) : (
                        <EmptyStateWidget
                            onClick={() =>
                                onMsg({
                                    type: 'on_add_custom_currency_click',
                                })
                            }
                            size="regular"
                            icon={({ size }) => (
                                <Tokens size={size} color="backgroundLight" />
                            )}
                            title={
                                <FormattedMessage
                                    id="token.widget.addTokens"
                                    defaultMessage="Add tokens"
                                />
                            }
                        />
                    )}
                </Group>
            </Section>

            <LastRefreshed
                fetchedAt={fetchedAt}
                onClick={() => onMsg({ type: 'reload_button_click' })}
            />
        </Column>
    )
}
