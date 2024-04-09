import React from 'react'

import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { Avatar } from '@zeal/domains/Account/components/Avatar'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

type Props = {
    installationId: string
    account: Account
    selected: boolean
    selectionVariant: 'default' | 'checkbox'
    keyStore: KeyStore
    portfolio: Portfolio | null // can be not loaded yet
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'account_item_clicked'; account: Account }

// TODO :: rename, this is confusing
export const UnlockedListItem = ({
    account,
    portfolio,
    selected,
    keyStore,
    selectionVariant,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <>
            <ListItem
                size="large"
                onClick={() => {
                    onMsg({
                        type: 'account_item_clicked',
                        account,
                    })
                }}
                avatar={({ size }) => (
                    <Avatar account={account} keystore={keyStore} size={size} />
                )}
                primaryText={account.label}
                shortText={
                    <Row spacing={16}>
                        <CopyAddress
                            installationId={installationId}
                            size="small"
                            color="on_light"
                            address={account.address}
                        />
                        <Text>
                            {sum && (
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={portfolio.currencies}
                                />
                            )}
                        </Text>
                    </Row>
                }
                aria-current={selectionVariant === 'default' ? selected : false}
                side={
                    selectionVariant === 'checkbox'
                        ? {
                              rightIcon: ({ size }) =>
                                  selected ? (
                                      <Checkbox
                                          size={size}
                                          color="iconAccent2"
                                      />
                                  ) : (
                                      <NotSelected
                                          size={size}
                                          color="iconDefault"
                                      />
                                  ),
                          }
                        : undefined
                }
            />
        </>
    )
}
