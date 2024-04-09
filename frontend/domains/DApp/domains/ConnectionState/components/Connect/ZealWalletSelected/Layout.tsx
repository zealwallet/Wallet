import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { InputButton as AccountInputButton } from '@zeal/domains/Account/components/InputButton'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Content as DAppContent } from '@zeal/domains/DApp/components/Content'
import { KeyStore } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { InputButton as NetworkInputButton } from '@zeal/domains/Network/components/InputButton'
import { Portfolio } from '@zeal/domains/Portfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { ConnectionBadge } from '@zeal/domains/SafetyCheck/components/ConnectionBadge'
import { getHighlighting } from '@zeal/domains/SafetyCheck/helpers/getTextHighlighting'

import { Actions } from './Actions'

import {
    ConnectedToMetaMask,
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from '../../..'
import { SafetyChecks } from '../SafetyChecks'

type Props = {
    alternativeProvider: AlternativeProvider
    connectionState:
        | DisconnectedState
        | NotInteractedState
        | ConnectedToMetaMask
    selectedNetwork: Network
    selectedAccount: Account
    portfolio: Portfolio | null

    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap

    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'account_selector_click' }
    | { type: 'network_selector_click' }
    | { type: 'on_minimize_click' }
    | { type: 'reject_connection_button_click' }
    | MsgOf<typeof Actions>

export const Layout = ({
    connectionState,
    selectedNetwork,
    selectedAccount,
    safetyChecksLoadable,
    portfolio,
    keystore,
    currencyHiddenMap,
    alternativeProvider,
    installationId,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <Text variant="title3" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="connection_state.connect.expanded.title"
                            defaultMessage="Connect"
                        />
                    </Text>
                }
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    footer={
                        <SafetyChecks
                            safetyChecksLoadable={safetyChecksLoadable}
                            onMsg={onMsg}
                        />
                    }
                >
                    <DAppContent
                        highlightHostName={getHighlighting(
                            safetyChecksLoadable
                        )}
                        dApp={connectionState.dApp}
                        avatarBadge={({ size }) => (
                            <ConnectionBadge
                                size={size}
                                safetyChecksLoadable={safetyChecksLoadable}
                            />
                        )}
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

                <Actions
                    alternativeProvider={alternativeProvider}
                    installationId={installationId}
                    safetyChecksLoadable={safetyChecksLoadable}
                    selectedAccount={selectedAccount}
                    selectedNetwork={selectedNetwork}
                    keystore={keystore}
                    onMsg={onMsg}
                />
            </Column>
        </Screen>
    )
}
