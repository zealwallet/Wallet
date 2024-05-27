import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ChangeAccount } from '@zeal/domains/Account/features/ChangeAccount'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConfirmSafetyCheckConnection } from '@zeal/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { SafetyChecksPopup } from '@zeal/domains/SafetyCheck/components/SafetyChecksPopup'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

export type State =
    | { type: 'closed' }
    | { type: 'account_selector' }
    | { type: 'safety_checks'; safetyChecks: ConnectionSafetyCheck[] }
    | {
          type: 'safety_checks_user_confirmation_required'
          safetyChecks: ConnectionSafetyCheck[]
          account: Account
      }

type Props = {
    state: State
    account: Account
    accountsMap: AccountsMap
    dAppSiteInfo: DAppSiteInfo
    installationId: string

    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_approve'; account: Account }
    | {
          type: 'on_user_confirmed_connection_with_safety_checks'
          account: Account
      }
    | MsgOf<typeof SafetyChecksPopup>
    | MsgOf<typeof ChangeAccount>
    | Extract<
          MsgOf<typeof ConfirmSafetyCheckConnection>,
          { type: 'confirmation_modal_close_clicked' }
      >

export const Modal = ({
    state,
    account,
    accountsMap,
    installationId,
    dAppSiteInfo,
    currencyHiddenMap,
    customCurrencyMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'safety_checks':
            return (
                <SafetyChecksPopup
                    dAppSiteInfo={dAppSiteInfo}
                    onMsg={onMsg}
                    safetyChecks={state.safetyChecks}
                />
            )

        case 'account_selector':
            return (
                <UIModal>
                    <ChangeAccount
                        alternativeProvider="provider_unavailable"
                        selectedProvider={{ type: 'zeal', account: account }}
                        installationId={installationId}
                        accounts={accountsMap}
                        currencyHiddenMap={currencyHiddenMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        customCurrencyMap={customCurrencyMap}
                        sessionPassword={sessionPassword}
                        portfolioMap={portfolioMap}
                        keystoreMap={keystoreMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'safety_checks_user_confirmation_required':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'confirmation_modal_close_clicked':
                                onMsg(msg)
                                break

                            case 'on_user_confirmed_connection_with_safety_checks':
                                onMsg({
                                    type: 'on_user_confirmed_connection_with_safety_checks',
                                    account: state.account,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
