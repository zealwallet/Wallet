import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Expanded, Msg as ExpandedMsg } from './Expanded'

import { Connected as ConnectedState } from '../../..'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null

    selectedNetwork: Network
    selectedAccount: Account
    alternativeProvider: AlternativeProvider
    connectionState: ConnectedState
    accounts: AccountsMap

    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string

    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof LockScreen> | ExpandedMsg

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
    selectedNetwork,
    selectedAccount,
    connectionState,
    portfolioMap,
    keystores,
    accounts,
    alternativeProvider,
    sessionPassword,
    encryptedPassword,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
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
                <Expanded
                    installationId={installationId}
                    alternativeProvider={alternativeProvider}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencyMap={customCurrencyMap}
                    sessionPassword={state.sessionPassword}
                    selectedNetwork={selectedNetwork}
                    selectedAccount={selectedAccount}
                    connectionState={connectionState}
                    accounts={accounts}
                    portfolioMap={portfolioMap}
                    keystores={keystores}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

export { AccessChecker as Expanded }
