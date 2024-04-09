import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { Avatar } from '@zeal/domains/Currency/components/Avatar'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CustomNetwork, Network } from '@zeal/domains/Network'

type Props = {
    customNetwork: CustomNetwork
    account: Account
    dApp: DAppSiteInfo
    network: Network
    keyStore: KeyStore

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_minimize_click' }
    | { type: 'close' }
    | { type: 'on_network_add_clicked'; customNetwork: CustomNetwork }

export const Layout = ({
    keyStore,
    customNetwork,
    account,
    dApp,
    network,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                keystore={keyStore}
                network={network}
                account={account}
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => {
                            onMsg({ type: 'on_minimize_click' })
                        }}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={12} fill>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="rpc.addCustomNetwork.title"
                                    defaultMessage="Add network"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="rpc.addCustomNetwork.subtitle"
                                    defaultMessage="Using {name}"
                                    values={{
                                        name: dApp.title || dApp.hostname,
                                    }}
                                />
                            }
                        />
                    }
                >
                    <Column spacing={24}>
                        <Column spacing={16}>
                            <Column spacing={8}>
                                <Text
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.networkName"
                                        defaultMessage="Network name"
                                    />
                                </Text>

                                <Text
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.name}
                                </Text>
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.chainId"
                                        defaultMessage="Chain ID"
                                    />
                                </Text>

                                <Text
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.hexChainId}
                                </Text>
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.rpcUrl"
                                        defaultMessage="RPC URL"
                                    />
                                </Text>

                                <Text
                                    variant="callout"
                                    weight="medium"
                                    color="textPrimary"
                                >
                                    {customNetwork.rpcUrl}
                                </Text>
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="footnote"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="rpc.addCustomNetwork.nativeToken"
                                        defaultMessage="Native token"
                                    />
                                </Text>

                                <Row spacing={12}>
                                    <Avatar
                                        currency={customNetwork.nativeCurrency}
                                        size={32}
                                    />

                                    <Text
                                        variant="callout"
                                        weight="medium"
                                        color="textPrimary"
                                    >
                                        {customNetwork.nativeCurrency.symbol}
                                    </Text>
                                </Row>
                            </Column>
                        </Column>

                        <Text
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="rpc.addCustomNetwork.operationDescription"
                                defaultMessage="Allows this website to add a network to your wallet. Zeal cannot check the safety of custom networks, make sure you understand the risks."
                            />
                        </Text>
                    </Column>
                </Content>

                <Actions>
                    <Button
                        variant="secondary"
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'close',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <Button
                        variant="primary"
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'on_network_add_clicked',
                                customNetwork,
                            })
                        }}
                    >
                        <FormattedMessage
                            id="rpc.addCustomNetwork.addNetwork"
                            defaultMessage="Add network"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
