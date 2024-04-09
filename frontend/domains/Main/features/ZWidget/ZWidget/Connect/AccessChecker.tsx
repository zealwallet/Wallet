import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    Disconnected as DisconnectedState,
    NotInteracted as NotInteractedState,
} from '@zeal/domains/DApp/domains/ConnectionState'
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

    connectionState: DisconnectedState | NotInteractedState

    alternativeProvider: AlternativeProvider

    initialAccount: Account
    requestedNetwork: Network

    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    dApps: Record<string, DAppConnectionState>
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof LockScreen> | MsgOf<typeof Connect>

type State =
    | { type: 'locked'; encryptedPassword: string }
    | { type: 'unlocked'; sessionPassword: string }

const calculateState = ({
    sessionPassword,
    encryptedPassword,
}: {
    sessionPassword: string | null
    encryptedPassword: string
}): State => {
    if (sessionPassword) {
        return { type: 'unlocked', sessionPassword }
    }

    return { type: 'locked', encryptedPassword }
}

export const AccessChecker = ({
    initialAccount,
    connectionState,
    portfolioMap,
    accounts,
    keystores,
    sessionPassword,
    encryptedPassword,
    requestedNetwork,
    customCurrencyMap,
    currencyHiddenMap,
    networkMap,
    networkRPCMap,
    alternativeProvider,
    dApps,
    installationId,
    onMsg,
}: Props) => {
    const state = calculateState({ sessionPassword, encryptedPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={state.encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'unlocked':
            return (
                <Connect
                    installationId={installationId}
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencyMap={customCurrencyMap}
                    sessionPassword={state.sessionPassword}
                    requestedNetwork={requestedNetwork}
                    connectionState={connectionState}
                    initialAccount={initialAccount}
                    portfolioMap={portfolioMap}
                    keystores={keystores}
                    accounts={accounts}
                    dApps={dApps}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
