import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { AddressBook } from '@zeal/uikit/Icon/AddressBook'

export const EmptySearchForValidAddress = () => (
    <EmptyStateWidget
        size="large"
        title={
            <FormattedMessage
                id="account.accounts_not_found_search_valid_address"
                defaultMessage="Wallet is not in your list"
            />
        }
        icon={({ size }) => <AddressBook size={size} color="iconDefault" />}
    />
)
