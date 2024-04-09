import React from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ConnectedToMetaMask } from '@zeal/domains/DApp/domains/ConnectionState'
import { Connect } from '@zeal/domains/DApp/domains/ConnectionState/components/Connect'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null
    connectionState: ConnectedToMetaMask
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    dApps: Record<string, DAppConnectionState>
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | MsgOf<typeof LockScreen>
    | MsgOf<typeof Connect>

type InternalState =
    | { type: 'locked' }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
}: {
    sessionPassword: string | null
}): InternalState => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }
    return { type: 'locked' }
}
export const Expanded = ({
    sessionPassword,
    encryptedPassword,
    currencyHiddenMap,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    requestedNetwork,
    alternativeProvider,
    initialAccount,
    accounts,
    portfolioMap,
    keystores,
    connectionState,
    dApps,
    installationId,
    onMsg,
}: Props) => {
    const state = calculateState({ sessionPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            return (
                <Connect
                    installationId={installationId}
                    connectionState={connectionState}
                    alternativeProvider={alternativeProvider}
                    portfolioMap={portfolioMap}
                    keystores={keystores}
                    accounts={accounts}
                    customCurrencyMap={customCurrencyMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    currencyHiddenMap={currencyHiddenMap}
                    sessionPassword={state.sessionPassword}
                    requestedNetwork={requestedNetwork}
                    initialAccount={initialAccount}
                    dApps={dApps}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
