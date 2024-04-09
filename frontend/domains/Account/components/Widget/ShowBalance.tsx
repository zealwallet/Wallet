import React from 'react'

import { notReachable } from '@zeal/toolkit'

import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { FormattedTokenBalances } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

type Props = {
    portfolio: Portfolio | null
    currentNetwork: CurrentNetwork
    currencyHiddenMap: CurrencyHiddenMap
}

export type Msg = { type: 'close' }

export const ShowBalance = ({
    portfolio,
    currentNetwork,
    currencyHiddenMap,
}: Props) => {
    if (!portfolio) {
        return <>0</>
    }

    const sum = sumPortfolio(portfolio, currencyHiddenMap)

    switch (currentNetwork.type) {
        case 'all_networks': {
            return (
                <FormattedTokenBalanceInDefaultCurrency
                    money={sum}
                    knownCurrencies={portfolio.currencies}
                />
            )
        }
        case 'specific_network': {
            const { network } = currentNetwork
            switch (network.type) {
                case 'predefined':
                    return (
                        <FormattedTokenBalanceInDefaultCurrency
                            money={sum}
                            knownCurrencies={portfolio.currencies}
                        />
                    )
                case 'custom':
                case 'testnet':
                    const token = portfolio.tokens.find((token) => {
                        return (
                            token.balance.currencyId ===
                            network.nativeCurrency.id
                        )
                    })

                    return token ? (
                        <FormattedTokenBalances
                            money={token.balance}
                            knownCurrencies={portfolio.currencies}
                        />
                    ) : null
                /* istanbul ignore next */
                default:
                    return notReachable(network)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(currentNetwork)
    }
}
