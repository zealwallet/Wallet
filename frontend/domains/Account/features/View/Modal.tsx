import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    Manage as ManageAccounts,
    Msg as ManageAccountsMsg,
} from '@zeal/domains/Account/features/Manage'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    CurrentNetwork,
    NetworkMap,
    NetworkRPCMap,
} from '@zeal/domains/Network'
import { NetworkFilter } from '@zeal/domains/Network/features/Fillter'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    state: State
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    installationId: string

    selectedNetwork: CurrentNetwork
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    account: Account
    encryptedPassword: string

    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | ManageAccountsMsg
    | MsgOf<typeof NetworkFilter>

export type State =
    | { type: 'closed' }
    | { type: 'account_filter' }
    | { type: 'network_filter' }

export const Modal = ({
    state,
    account,
    accounts,
    portfolioMap,
    selectedNetwork,
    networkRPCMap,
    keystoreMap,
    encryptedPassword,
    networkMap,
    currencyHiddenMap,
    installationId,
    sessionPassword,
    customCurrencyMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'network_filter': {
            const portfolio = getPortfolio({
                address: account.address,
                portfolioMap,
            })

            const networks: CurrentNetwork[] = [
                { type: 'all_networks' } as const,
                ...values(networkMap).map(
                    (network): CurrentNetwork => ({
                        type: 'specific_network',
                        network,
                    })
                ),
            ]
            return (
                <UIModal>
                    <NetworkFilter
                        installationId={installationId}
                        networkMap={networkMap}
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        keyStoreMap={keystoreMap}
                        networks={networks}
                        portfolio={portfolio}
                        currentNetwork={selectedNetwork}
                        networkRPCMap={networkRPCMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        }
        case 'account_filter':
            return (
                <UIModal>
                    <ManageAccounts
                        customCurrencyMap={customCurrencyMap}
                        networkMap={networkMap}
                        sessionPassword={sessionPassword}
                        installationId={installationId}
                        networkRPCMap={networkRPCMap}
                        currencyHiddenMap={currencyHiddenMap}
                        encryptedPassword={encryptedPassword}
                        keystoreMap={keystoreMap}
                        portfolioMap={portfolioMap}
                        accounts={accounts}
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
