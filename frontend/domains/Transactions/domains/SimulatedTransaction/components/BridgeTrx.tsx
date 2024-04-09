import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Section } from '@zeal/uikit/Group'
import { GroupHeader } from '@zeal/uikit/Group'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { BridgeRouteFromListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteFromListItem'
import { BridgeRouteToListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteToListItem'
import { ImperativeError } from '@zeal/domains/Error'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from '@zeal/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { BridgeTrx } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

type Props = {
    transaction: BridgeTrx
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
}
export type Msg = { type: 'close' }

export const BridgeTrxView = ({
    transaction,
    networkMap,
    knownCurrencies,
}: Props) => {
    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: transaction.bridgeRoute.to.currencyId,
        knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: transaction.bridgeRoute.from.currencyId,
        knownCurrencies: knownCurrencies,
    })

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        toCurrency.networkHexChainId,
        networkMap
    )

    return (
        <Column spacing={16}>
            <Section>
                <GroupHeader
                    left={({ color, textVariant, textWeight }) => (
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="currency.bridge.bridge_from"
                                defaultMessage="From"
                            />
                        </Text>
                    )}
                    right={() => (
                        <FancyButton
                            rounded={true}
                            network={fromNetwork}
                            onClick={null}
                        />
                    )}
                />
                <BridgeRouteFromListItem
                    bridgeRoute={transaction.bridgeRoute}
                    requestStatus={{ type: 'not_started' }}
                    knownCurrencies={knownCurrencies}
                />
            </Section>
            <Section>
                <GroupHeader
                    left={({ color, textVariant, textWeight }) => (
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="currency.bridge.bridge_to"
                                defaultMessage="To"
                            />
                        </Text>
                    )}
                    right={() => (
                        <FancyButton
                            rounded={true}
                            network={toNetwork}
                            onClick={null}
                        />
                    )}
                />
                <BridgeRouteToListItem
                    bridgeRoute={transaction.bridgeRoute}
                    bridgeStatus={{
                        targetTransaction: { type: 'not_started' },
                        refuel: transaction.bridgeRoute.refuel && {
                            type: 'not_started',
                        },
                    }}
                    knownCurrencies={knownCurrencies}
                />
            </Section>
        </Column>
    )
}

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
