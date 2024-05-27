import React from 'react'
import { FlatList } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Clickable } from '@zeal/uikit/Clickable'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { App, Lending } from '@zeal/domains/App'
import { AppProtocolGroup } from '@zeal/domains/App/components/AppPoolGroup'
import { KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap } from '@zeal/domains/Network'

type Props = {
    account: Account
    keystore: KeyStore
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    app: App
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_health_rate_info_click'; protocol: Lending }

export const Layout = ({
    account,
    keystore,
    networkMap,
    knownCurrencies,
    app,
    onMsg,
}: Props) => {
    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                top={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />
                            <Row spacing={8}>
                                <Text
                                    variant="title3"
                                    weight="semi_bold"
                                    color="textPrimary"
                                >
                                    {app.name}
                                </Text>

                                {app.url && (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() =>
                                            openExternalURL(app.url!)
                                        }
                                    >
                                        {({ color }) => (
                                            <ExternalLink
                                                size={16}
                                                color={color}
                                            />
                                        )}
                                    </IconButton>
                                )}
                            </Row>
                        </Row>
                    </Clickable>
                }
            />

            <FlatList
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                data={app.protocols}
                renderItem={({ item: protocol }) => (
                    <AppProtocolGroup
                        key={protocol.type}
                        protocol={protocol}
                        onMsg={onMsg}
                        knownCurrencies={knownCurrencies}
                        networkMap={networkMap}
                    />
                )}
                ItemSeparatorComponent={() => <Spacer size={12} />}
            />
        </Screen>
    )
}
