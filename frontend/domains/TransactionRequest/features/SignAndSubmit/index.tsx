import { useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import {
    CancelSimulated,
    Simulated,
    Submited,
} from '@zeal/domains/TransactionRequest'
import { Cancel } from '@zeal/domains/TransactionRequest/features/Cancel'
import {
    Sign,
    State as LayoutState,
} from '@zeal/domains/TransactionRequest/features/Sign'
import { cancelSimulatedToSubmited } from '@zeal/domains/TransactionRequest/helpers/cancelSimulatedToSubmited'

type Props = {
    transactionRequest: Simulated | Submited
    keyStore: SigningKeyStore
    sessionPassword: string
    installationId: string
    layoutState: LayoutState
    source: components['schemas']['TransactionEventSource']
    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Cancel>,
          {
              type:
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'cancel_submitted'
          }
      >
    | Extract<
          MsgOf<typeof Sign>,
          {
              type:
                  | 'drag'
                  | 'on_expand_request'
                  | 'on_minimize_click'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_cancelled_accepted'
                  | 'on_completed_transaction_close_click'
                  | 'transaction_failure_accepted'
                  | 'transaction_submited'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_sign_with_hw_wallet_cancel_clicked'
                  | 'on_close_transaction_status_not_found_modal'
                  | 'transaction_request_replaced'
          }
      >

type State =
    | {
          type: 'sign'
          transactionRequest: Simulated | Submited
      }
    | {
          type: 'cancel'
          transactionRequest: CancelSimulated
      }

export const SignAndSubmit = ({
    transactionRequest,
    keyStore,
    sessionPassword,
    onMsg,
    accounts,
    layoutState,
    installationId,
    source,
    networkMap,
    networkRPCMap,
    keystores,
    actionSource,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'sign',
        transactionRequest,
    })

    switch (state.type) {
        case 'sign':
            return (
                <Sign
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    installationId={installationId}
                    source={source}
                    state={layoutState}
                    accounts={accounts}
                    keystores={keystores}
                    keyStore={keyStore}
                    sessionPassword={sessionPassword}
                    transactionRequest={transactionRequest}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'cancellation_confirmed':
                                setState({
                                    type: 'cancel',
                                    transactionRequest: msg.transactionRequest,
                                })
                                break
                            case 'on_sign_with_hw_wallet_cancel_clicked':
                            case 'on_minimize_click':
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_completed_transaction_close_click':
                            case 'transaction_failure_accepted':
                            case 'transaction_submited':
                            case 'on_sign_cancel_button_clicked':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'transaction_request_replaced':
                            case 'on_close_transaction_status_not_found_modal':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'cancel':
            return (
                <Cancel
                    installationId={installationId}
                    source={source}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    state={layoutState}
                    keyStore={keyStore}
                    sessionPassword={sessionPassword}
                    transactionRequest={state.transactionRequest}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_ledger_error_close':
                            case 'on_cancel_cancellation_click':
                                setState({
                                    type: 'sign',
                                    transactionRequest:
                                        cancelSimulatedToSubmited(
                                            state.transactionRequest
                                        ),
                                })
                                break
                            case 'transaction_cancel_success':
                            case 'on_expand_request':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_minimize_click':
                            case 'drag':
                            case 'cancel_submitted':
                            case 'on_close_transaction_status_not_found_modal':
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
