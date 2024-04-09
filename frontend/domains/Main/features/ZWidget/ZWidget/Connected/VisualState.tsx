import { useEffect, useState } from 'react'

import { DragAndDropBar } from '@zeal/uikit/DragAndClickHandler'

import { notReachable, useLiveRef } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { Connected as ConnectedState } from '@zeal/domains/DApp/domains/ConnectionState'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { AccessChecker, Msg as AccessCheckerMsg } from './AccessChecker'

type Props = {
    encryptedPassword: string
    sessionPassword: string | null
    customCurrencies: CustomCurrencyMap

    account: Account
    network: Network
    keyStore: KeyStore

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    portfolioMap: PortfolioMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    installationId: string

    interactionRequest: InteractionRequest

    connectionState: ConnectedState

    onMsg: (msg: Msg) => void
}

type State = { type: 'minimised' } | { type: 'maximised' }

export type Msg =
    | Extract<
          AccessCheckerMsg,
          {
              type:
                  | 'cancel_button_click'
                  | 'cancel_submitted'
                  | 'close'
                  | 'drag'
                  | 'import_keys_button_clicked'
                  | 'keystore_added'
                  | 'message_signed'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_completed_transaction_close_click'
                  | 'on_gas_currency_selected'
                  | 'on_network_add_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_safe_deployemnt_cancelled'
                  | 'on_safe_transaction_completed_splash_animation_screen_competed'
                  | 'on_safe_transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_wrong_network_accepted'
                  | 'session_password_decrypted'
                  | 'transaction_cancel_failure_accepted'
                  | 'transaction_cancel_success'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'transaction_submited'
                  | 'transaction_request_replaced'
                  | 'on_close_transaction_status_not_found_modal'
                  | 'on_completed_safe_transaction_close_click'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_4337_gas_currency_selected'
          }
      >
    | { type: 'expanded' }
    | { type: 'minimized' }

export const VisualState = ({
    connectionState,
    onMsg,
    account,
    keyStore,
    network,
    sessionPassword,
    encryptedPassword,
    interactionRequest,
    keystores,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    accounts,
    portfolioMap,
    customCurrencies,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'maximised' })
    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'minimised':
                liveMsg.current({ type: 'minimized' })
                break
            case 'maximised':
                liveMsg.current({ type: 'expanded' })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveMsg, state])

    return (
        <>
            {(() => {
                switch (state.type) {
                    case 'minimised':
                        return null
                    case 'maximised':
                        return <DragAndDropBar onMsg={onMsg} />
                    /* istanbul ignore next */
                    default:
                        return notReachable(state)
                }
            })()}
            <AccessChecker
                gasCurrencyPresetMap={gasCurrencyPresetMap}
                customCurrencies={customCurrencies}
                portfolioMap={portfolioMap}
                feePresetMap={feePresetMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                installationId={installationId}
                accounts={accounts}
                keystores={keystores}
                encryptedPassword={encryptedPassword}
                sessionPassword={sessionPassword}
                account={account}
                network={network}
                keyStore={keyStore}
                interactionRequest={interactionRequest}
                connectionState={connectionState}
                state={state}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'lock_screen_close_click':
                        case 'on_minimize_click':
                            setState({ type: 'minimised' })
                            break
                        case 'on_expand_request':
                            setState({ type: 'maximised' })
                            break

                        case 'on_cancel_confirm_transaction_clicked':
                        case 'transaction_submited':
                        case 'cancel_submitted':
                        case 'session_password_decrypted':
                        case 'transaction_cancel_failure_accepted':
                        case 'on_safe_transaction_failure_accepted':
                        case 'transaction_cancel_success':
                        case 'on_completed_transaction_close_click':
                        case 'on_completed_safe_transaction_close_click':
                        case 'transaction_failure_accepted':
                        case 'drag':
                        case 'message_signed':
                        case 'cancel_button_click':
                        case 'on_sign_cancel_button_clicked':
                        case 'import_keys_button_clicked':
                        case 'on_transaction_completed_splash_animation_screen_competed':
                        case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                        case 'close':
                        case 'on_network_add_clicked':
                        case 'on_predefined_fee_preset_selected':
                        case 'on_4337_gas_currency_selected':
                        case 'on_wrong_network_accepted':
                        case 'on_safe_deployemnt_cancelled':
                        case 'transaction_request_replaced':
                        case 'on_close_transaction_status_not_found_modal':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
