import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { LightArrowDown2 } from '@zeal/uikit/Icon/LightArrowDown2'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { ListItem } from '@zeal/uikit/ListItem'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Avatar } from '@zeal/domains/Account/components/Avatar'
import { Address } from '@zeal/domains/Address'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    installationId: string
    address: Address
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
    onClick: () => void
}

export const ToAddress = ({
    address,
    accountsMap,
    keyStoreMap,
    installationId,
    onClick,
}: Props) => {
    const account: Account | null = accountsMap[address]
    const keyStore = getKeyStore({
        keyStoreMap: keyStoreMap,
        address,
    })

    return account ? (
        <ListItem
            size="large"
            onClick={onClick}
            avatar={({ size }) => (
                <Avatar account={account} keystore={keyStore} size={size} />
            )}
            primaryText={account.label}
            shortText={
                <CopyAddress
                    installationId={installationId}
                    size="small"
                    color="on_light"
                    address={account.address}
                />
            }
            aria-current={false}
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    ) : (
        <ListItem
            size="large"
            onClick={onClick}
            avatar={({ size }) => (
                <UIAvatar size={size}>
                    <QuestionCircle size={size} color="iconDefault" />
                </UIAvatar>
            )}
            primaryText={
                <FormattedMessage
                    id="send_token.form.unlabelled-wallet"
                    defaultMessage="Unlabelled wallet"
                />
            }
            shortText={
                <CopyAddress
                    installationId={installationId}
                    address={address}
                    color="on_light"
                    size="regular"
                />
            }
            aria-current={false}
            side={{
                rightIcon: ({ size }) => (
                    <LightArrowDown2 size={size} color="iconDefault" />
                ),
            }}
        />
    )
}
