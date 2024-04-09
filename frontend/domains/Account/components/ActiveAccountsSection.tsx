import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { BoldAddWallet } from '@zeal/uikit/Icon/BoldAddWallet'
import { ListItem } from '@zeal/uikit/ListItem'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'

type Props = {
    accounts: Account[]
    listItem: (_: { account: Account }) => React.ReactNode
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'add_new_account_click' }

export const ActiveAccountsSection = ({ accounts, listItem, onMsg }: Props) => (
    <Section>
        <GroupHeader
            left={({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <FormattedMessage
                        id="address_book.change_account.wallets_header"
                        defaultMessage="Active"
                    />
                </Text>
            )}
            right={null}
        />
        <Group variant="default">
            {accounts.length ? (
                accounts.map((account) => listItem({ account }))
            ) : (
                <ListItem
                    size="regular"
                    aria-current={false}
                    avatar={({ size }) => (
                        <BoldAddWallet size={size} color="iconAccent2" />
                    )}
                    primaryText={
                        <FormattedMessage
                            id="account.add_active_wallet.primary_text"
                            defaultMessage="Add wallet"
                        />
                    }
                    shortText={
                        <FormattedMessage
                            id="account.add_active_wallet.short_text"
                            defaultMessage="Create, Connect or Import Wallet"
                        />
                    }
                    onClick={() =>
                        onMsg({
                            type: 'add_new_account_click',
                        })
                    }
                />
            )}
        </Group>
    </Section>
)
