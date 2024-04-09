import { FormattedMessage } from 'react-intl'

import { Content } from '@zeal/uikit/Content'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    ChangeAccount,
    Msg as ChangeAccountMsg,
} from '@zeal/domains/Account/features/ChangeAccount'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import {
    CurrentNetwork,
    Network,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { SafetyChecksPopup } from '@zeal/domains/SafetyCheck/components/SafetyChecksPopup'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    state: State

    dAppSiteInfo: DAppSiteInfo

    networks: Network[]
    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap
    accounts: AccountsMap
    selectedAccount: Account
    networkMap: NetworkMap
    alternativeProvider: AlternativeProvider
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string

    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | ChangeAccountMsg
    | MsgOf<typeof NetworkFilter>
    | { type: 'connected_animation_complete' }

export type State =
    | { type: 'closed' }
    | { type: 'network_selector' }
    | { type: 'account_selector' }
    | { type: 'safety_checks'; safetyChecks: ConnectionSafetyCheck[] }
    | { type: 'connection_confirmation' }

export const Modal = ({
    state,
    networks,
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    accounts,
    portfolioMap,
    keystores,
    dAppSiteInfo,
    alternativeProvider,
    customCurrencyMap,
    sessionPassword,
    currencyHiddenMap,
    networkMap,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'connection_confirmation':
            return (
                <ConnectionSuccess
                    keystore={getKeyStore({
                        keyStoreMap: keystores,
                        address: selectedAccount.address,
                    })}
                    selectedNetwork={selectedNetwork}
                    selectedAccount={selectedAccount}
                    onMsg={onMsg}
                />
            )

        case 'network_selector':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={selectedAccount}
                        keyStoreMap={keystores}
                        portfolio={getPortfolio({
                            address: selectedAccount.address,
                            portfolioMap,
                        })}
                        currentNetwork={
                            {
                                type: 'specific_network',
                                network: selectedNetwork,
                            } as CurrentNetwork
                        }
                        networkRPCMap={networkRPCMap}
                        networks={networks.map(
                            (network): CurrentNetwork => ({
                                type: 'specific_network',
                                network,
                            })
                        )}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'account_selector':
            return (
                <UIModal>
                    <ChangeAccount
                        installationId={installationId}
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolioMap={portfolioMap}
                        keystoreMap={keystores}
                        selectedProvider={{
                            type: 'zeal',
                            account: selectedAccount,
                        }}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'safety_checks':
            return (
                <SafetyChecksPopup
                    dAppSiteInfo={dAppSiteInfo}
                    onMsg={onMsg}
                    safetyChecks={state.safetyChecks}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const ConnectionSuccess = ({
    selectedNetwork,
    selectedAccount,
    keystore,
    onMsg,
}: {
    selectedNetwork: Network
    selectedAccount: Account
    keystore: KeyStore
    onMsg: (msg: { type: 'connected_animation_complete' }) => void
}) => {
    return (
        <UIModal>
            <Screen background="light" padding="form">
                <ActionBar
                    keystore={keystore}
                    network={selectedNetwork}
                    account={selectedAccount}
                />
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="connection_state.connect.expanded.title"
                                    defaultMessage="Connect"
                                />
                            }
                        />
                    }
                >
                    <Content.Splash
                        onAnimationComplete={() =>
                            onMsg({ type: 'connected_animation_complete' })
                        }
                        variant="success"
                        title={
                            <FormattedMessage
                                id="connection_state.connect.expanded.connected"
                                defaultMessage="Connected"
                            />
                        }
                    />
                </Content>
            </Screen>
        </UIModal>
    )
}
