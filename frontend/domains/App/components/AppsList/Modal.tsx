import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { App } from '@zeal/domains/App'
import { AppPositionDetails } from '@zeal/domains/App/components/AppPositionDetails'
import { CurrencyHiddenMap, KnownCurrencies } from '@zeal/domains/Currency'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { getAllNetworksFromNetworkMap } from '@zeal/domains/Network/helpers/getAllNetworksFromNetworkMap'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    account: Account
    keystore: KeyStore
    networkMap: NetworkMap
    knownCurrencies: KnownCurrencies
    state: State
    installationId: string
    networkRPCMap: NetworkRPCMap
    keystoreMap: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    portfolioMap: PortfolioMap
    selectedNetwork: CurrentNetwork
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof NetworkFilter>

export type State =
    | { type: 'closed' }
    | { type: 'network_filter' }
    | { type: 'app_position_details'; app: App }

export const Modal = ({
    account,
    keystore,
    knownCurrencies,
    networkMap,
    state,
    installationId,
    networkRPCMap,
    keystoreMap,
    currencyHiddenMap,
    portfolioMap,
    selectedNetwork,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'app_position_details':
            return (
                <UIModal>
                    <AppPositionDetails
                        account={account}
                        keystore={keystore}
                        networkMap={networkMap}
                        knownCurrencies={knownCurrencies}
                        app={state.app}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'network_filter':
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        networks={getAllNetworksFromNetworkMap(networkMap)}
                        networkRPCMap={networkRPCMap}
                        portfolio={getPortfolio({
                            address: account.address,
                            portfolioMap,
                        })}
                        currentNetwork={selectedNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
