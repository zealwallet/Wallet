import React from 'react'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { Avatar as NetworkAvatar } from '@zeal/domains/Network/components/Avatar'

type Props = {
    network: Network | null
    account: Account
    keystore: KeyStore

    left?: React.ReactNode
    right?: React.ReactNode
}

/**
 * @deprecated Use ActionBar2 or ActionBarWithSelector or ActionBar from uikit directly
 */
export const ActionBar = ({
    left,
    right,
    account,
    keystore,
    network,
}: Props) => (
    <UIActionBar
        left={left}
        right={right}
        center={
            <Row grow shrink spacing={8}>
                {network && (
                    <NetworkAvatar
                        size={24}
                        currentNetwork={{
                            type: 'specific_network',
                            network,
                        }}
                    />
                )}
                <Row spacing={0}>
                    <AccountAvatar size={24} account={account} />
                </Row>
                <Text
                    variant="footnote"
                    color="textSecondary"
                    weight="regular"
                    ellipsis
                >
                    {account.label}
                </Text>
                <Row spacing={0}>
                    <Text
                        variant="footnote"
                        color="textSecondary"
                        weight="regular"
                    >
                        {formatAddress(account.address)}
                    </Text>
                </Row>
            </Row>
        }
    />
)
