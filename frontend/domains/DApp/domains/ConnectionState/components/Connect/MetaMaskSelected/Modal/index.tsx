import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import {
    ConnectedToMetaMask,
    Disconnected,
    NotInteracted,
} from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { ConfirmSafetyCheckConnection } from '@zeal/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { SafetyChecksPopup } from '@zeal/domains/SafetyCheck/components/SafetyChecksPopup'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { ChooseAccount } from './ChooseAccount'

type Props = {
    state: State
    accounts: AccountsMap
    alternativeProvider: 'metamask'
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    connectionState: NotInteracted | Disconnected | ConnectedToMetaMask
    requestedNetwork: Network
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ChooseAccount>
    | MsgOf<typeof ConfirmSafetyCheckConnection>

export type State =
    | { type: 'closed' }
    | { type: 'choose_account' }
    | { type: 'safety_checks'; safetyChecks: ConnectionSafetyCheck[] }
    | {
          type: 'confirm_connection_safety_checks'
          safetyChecks: ConnectionSafetyCheck[]
      }

export const Modal = ({
    state,
    accounts,
    portfolioMap,
    alternativeProvider,
    currencyHiddenMap,
    customCurrencyMap,
    keystoreMap,
    networkRPCMap,
    networkMap,
    sessionPassword,
    connectionState,
    requestedNetwork,
    safetyChecksLoadable,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'choose_account':
            return (
                <UIModal>
                    <ChooseAccount
                        installationId={installationId}
                        requestedNetwork={requestedNetwork}
                        safetyChecksLoadable={safetyChecksLoadable}
                        alternativeProvider={alternativeProvider}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        accounts={accounts}
                        portfolioMap={portfolioMap}
                        keystoreMap={keystoreMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        case 'safety_checks':
            return (
                <SafetyChecksPopup
                    dAppSiteInfo={connectionState.dApp}
                    onMsg={onMsg}
                    safetyChecks={state.safetyChecks}
                />
            )
        case 'confirm_connection_safety_checks':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'confirmation_modal_close_clicked':
                                onMsg(msg)
                                break
                            case 'on_user_confirmed_connection_with_safety_checks':
                                postUserEvent({
                                    type: 'ConnectionToggledToMetamaskEvent',
                                    installationId,
                                })
                                onMsg(msg)
                                break
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
