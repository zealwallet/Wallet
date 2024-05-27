import React from 'react'
import { useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { ThreeDotVertical } from '@zeal/uikit/Icon/ThreeDotVertical'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem as UIListItem } from '@zeal/uikit/ListItem'

import { Account } from '@zeal/domains/Account'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

import { Avatar } from '../Avatar'

type Props = {
    installationId: string
    account: Account
    selected: boolean
    keystore: KeyStore
    portfolio: Portfolio | null // can be not loaded yet
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'account_item_clicked'; account: Account }
    | { type: 'account_details_clicked'; account: Account }

export const ListItem = ({
    account,
    keystore,
    portfolio,
    selected,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <UIListItem
            size="regular"
            onClick={() => {
                onMsg({
                    type: 'account_item_clicked',
                    account,
                })
            }}
            avatar={({ size }) => (
                <Avatar account={account} keystore={keystore} size={size} />
            )}
            primaryText={account.label}
            shortText={
                sum ? (
                    <FormattedTokenBalanceInDefaultCurrency
                        money={sum}
                        knownCurrencies={portfolio.currencies}
                    />
                ) : (
                    '\u00A0' // \u00A0
                )
            }
            aria-current={selected}
            side={{
                title: <></>,
                subtitle: (
                    <Column spacing={0} alignY="end">
                        <CopyAddress
                            installationId={installationId}
                            size="small"
                            color="on_light"
                            address={account.address}
                        />
                    </Column>
                ),
                rightIcon: ({ size }) => (
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'Account.ListItem.details.label',
                            defaultMessage: 'Details',
                        })}
                        onClick={(e) => {
                            e.stopPropagation()
                            onMsg({
                                type: 'account_details_clicked',
                                account,
                            })
                        }}
                    >
                        {({ color }) => (
                            <ThreeDotVertical size={size} color={color} />
                        )}
                    </IconButton>
                ),
            }}
        />
    )
}
