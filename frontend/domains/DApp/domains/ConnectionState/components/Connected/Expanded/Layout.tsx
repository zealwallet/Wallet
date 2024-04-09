import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { InputButton as AccountInputButton } from '@zeal/domains/Account/components/InputButton'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Content as DAppContent } from '@zeal/domains/DApp/components/Content'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { InputButton as NetworkInputButton } from '@zeal/domains/Network/components/InputButton'
import { Portfolio } from '@zeal/domains/Portfolio'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Connected as ConnectedState } from '../../..'

type Props = {
    connectionState: ConnectedState
    alternativeProvider: AlternativeProvider

    selectedNetwork: Network
    selectedAccount: Account

    portfolio: Portfolio | null

    currencyHiddenMap: CurrencyHiddenMap
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'account_selector_click' }
    | { type: 'network_selector_click' }
    | { type: 'disconnect_button_click' }
    | { type: 'on_minimize_click' }
    | { type: 'use_meta_mask_instead_clicked' }

export const Layout = ({
    connectionState,
    selectedAccount,
    selectedNetwork,
    portfolio,
    currencyHiddenMap,
    alternativeProvider,
    installationId,
    onMsg,
}: Props) => {
    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <Text variant="title3" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="connection_state.connected.expanded.title"
                            defaultMessage="Connected"
                        />
                    </Text>
                }
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

            <Column spacing={12} alignY="stretch">
                <Content>
                    <DAppContent
                        highlightHostName={null}
                        dApp={connectionState.dApp}
                    />
                </Content>

                <Column spacing={12}>
                    <AccountInputButton
                        currencyHiddenMap={currencyHiddenMap}
                        account={selectedAccount}
                        onClick={() => {
                            onMsg({
                                type: 'account_selector_click',
                            })
                        }}
                        portfolio={portfolio}
                    />
                    <NetworkInputButton
                        network={selectedNetwork}
                        onClick={() => {
                            onMsg({ type: 'network_selector_click' })
                        }}
                    />
                </Column>

                <Actions variant="column">
                    <MetaMaskButton
                        installationId={installationId}
                        alternativeProvider={alternativeProvider}
                        onMsg={onMsg}
                    />

                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() => {
                            onMsg({ type: 'disconnect_button_click' })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connected.expanded.disconnectButton"
                            defaultMessage="Disconnect Zeal"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const MetaMaskButton = ({
    alternativeProvider,
    installationId,
    onMsg,
}: {
    alternativeProvider: AlternativeProvider
    installationId: string
    onMsg: (msg: { type: 'use_meta_mask_instead_clicked' }) => void
}) => {
    switch (alternativeProvider) {
        case 'metamask':
            return (
                <Actions>
                    <Button
                        variant="warning"
                        size="regular"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionToggledToMetamaskEvent',
                                installationId,
                            })
                            return onMsg({
                                type: 'use_meta_mask_instead_clicked',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="connection_state.connect.changeToMetamask"
                            defaultMessage="Change to MetaMask 🦊"
                        />
                    </Button>
                </Actions>
            )
        case 'provider_unavailable':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(alternativeProvider)
    }
}
