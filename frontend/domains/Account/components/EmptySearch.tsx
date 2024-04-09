import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { AddressBook } from '@zeal/uikit/Icon/AddressBook'

export const EmptySearch = () => (
    <EmptyStateWidget
        size="large"
        title={
            <FormattedMessage
                id="account.accounts_not_found"
                defaultMessage="We couldn’t find any wallets"
            />
        }
        icon={({ size }) => <AddressBook size={size} color="iconDefault" />}
    />
)
