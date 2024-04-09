import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ChangeAccount } from '@zeal/domains/Account/features/ChangeAccount'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { Connected } from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
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
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { ConnectToMetaMask } from './ConnectToMetaMask'

type Props = {
    state: State

    connectionState: Connected

    networks: Network[]
    selectedNetwork: Network
    networkRPCMap: NetworkRPCMap

    accounts: AccountsMap
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    sessionPassword: string
    keystores: KeyStoreMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof ChangeAccount>
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof ConnectToMetaMask>

export type State =
    | { type: 'closed' }
    | { type: 'network_selector' }
    | { type: 'account_selector' }
    | { type: 'meta_mask_selected' }

export const Modal = ({
    state,
    networks,
    selectedNetwork,
    networkRPCMap,
    selectedAccount,
    alternativeProvider,
    accounts,
    portfolioMap,
    keystores,
    onMsg,
    customCurrencyMap,
    networkMap,
    sessionPassword,
    connectionState,
    currencyHiddenMap,
    installationId,
}: Props) => {
    switch (state.type) {
        case 'meta_mask_selected':
            return (
                <UIModal>
                    <ConnectToMetaMask
                        installationId={installationId}
                        connectionState={connectionState}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'closed':
            return null
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
                        accounts={accounts}
                        portfolioMap={portfolioMap}
                        keystoreMap={keystores}
                        selectedProvider={{
                            type: 'zeal',
                            account: selectedAccount,
                        }}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
