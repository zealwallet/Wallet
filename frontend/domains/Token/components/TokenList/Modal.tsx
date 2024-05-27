import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { Receive } from '@zeal/domains/Account/features/Receive'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { AddCustom } from '@zeal/domains/Currency/features/AddCustom'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    CustomNetwork,
    NetworkMap,
    NetworkRPCMap,
    TestNetwork,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { getAllNetworksFromNetworkMap } from '@zeal/domains/Network/helpers/getAllNetworksFromNetworkMap'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { SendOrReceiveToken } from '@zeal/domains/RPCRequest/features/SendOrReceiveToken'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { HiddenTokens } from '@zeal/domains/Token/components/HiddenTokens'

type Props = {
    state: State
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    portfolio: Portfolio
    portfolioMap: PortfolioMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    account: Account
    keystoreMap: KeyStoreMap
    currentNetwork: CurrentNetwork
    customCurrencyMap: CustomCurrencyMap
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'add_custom_currency'; network: TestNetwork | CustomNetwork }
    | { type: 'hidden_tokens' }
    | { type: 'network_filter' }
    | { type: 'send_or_receive_token'; currencyId: string }
    | { type: 'receive_funds' }

type Msg =
    | MsgOf<typeof AddCustom>
    | MsgOf<typeof HiddenTokens>
    | MsgOf<typeof NetworkFilter>
    | MsgOf<typeof SendOrReceiveToken>
    | MsgOf<typeof Receive>

export const Modal = ({
    state,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
    portfolioMap,
    networkMap,
    networkRPCMap,
    installationId,
    account,
    keystoreMap,
    currentNetwork,
    customCurrencyMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'hidden_tokens':
            return (
                <UIModal>
                    <HiddenTokens
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        portfolio={portfolio}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'add_custom_currency':
            return (
                <UIModal>
                    <AddCustom
                        cryptoCurrency={null}
                        onMsg={onMsg}
                        network={state.network}
                        networkRPCMap={networkRPCMap}
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
                        currentNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'send_or_receive_token':
            return (
                <SendOrReceiveToken
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    customCurrencies={customCurrencyMap}
                    networkMap={networkMap}
                    fromAccount={account}
                    portfolioMap={portfolioMap}
                    currentNetwork={currentNetwork}
                    networkRPCMap={networkRPCMap}
                    currencyId={state.currencyId || null}
                    onMsg={onMsg}
                />
            )

        case 'receive_funds':
            return (
                <UIModal>
                    <Receive
                        installationId={installationId}
                        account={account}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
