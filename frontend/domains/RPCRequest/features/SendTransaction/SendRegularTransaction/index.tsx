import { useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    NotSigned,
    Simulated,
    Submited,
} from '@zeal/domains/TransactionRequest'
import { SignAndSubmit } from '@zeal/domains/TransactionRequest/features/SignAndSubmit'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import {
    ConfirmTransaction,
    FetchSimulationByRequest,
} from './ConfirmTransaction'

type Props = {
    sendTransactionRequest: EthSendTransaction
    sessionPassword: string

    account: Account
    network: Network
    networkRPCMap: NetworkRPCMap
    dApp: DAppSiteInfo | null

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    installationId: string
    source: components['schemas']['TransactionEventSource']

    fetchSimulationByRequest: FetchSimulationByRequest

    state: State
    actionSource: ActionSource

    onMsg: (msg: Msg) => void
}

type State = { type: 'minimised' } | { type: 'maximised' }

type InternalState =
    | {
          type: 'confirm_transaction'
          network: Network
          account: Account
          transactionRequest: NotSigned
      }
    | {
          type: 'sign_and_submit_transaction'
          keyStore: SigningKeyStore
          transactionRequest: Simulated | Submited
      }

export type Msg =
    | Extract<
          MsgOf<typeof ConfirmTransaction>,
          {
              type:
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_minimize_click'
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
          }
      >
    | Extract<
          MsgOf<typeof SignAndSubmit>,
          {
              type:
                  | 'drag'
                  | 'on_expand_request'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_cancelled_accepted'
                  | 'on_completed_transaction_close_click'
                  | 'transaction_failure_accepted'
                  | 'transaction_submited'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_transaction_cancelled_successfully_close_clicked'
                  | 'cancel_submitted'
                  | 'transaction_cancel_failure_accepted'
                  | 'on_close_transaction_status_not_found_modal'
                  | 'transaction_request_replaced'
          }
      >

export const SendRegularTransaction = ({
    account,
    dApp,
    network,
    networkRPCMap,
    sendTransactionRequest,
    sessionPassword,
    state,
    accounts,
    keystores,
    installationId,
    source,
    fetchSimulationByRequest,
    networkMap,
    feePresetMap,
    actionSource,
    onMsg,
}: Props) => {
    const [internalState, setInternalState] = useState<InternalState>({
        type: 'confirm_transaction',
        network,
        account,
        transactionRequest: {
            state: 'not_signed',
            account,
            dApp,
            networkHexId: network.hexChainId,
            rpcRequest: sendTransactionRequest,
        },
    })

    switch (internalState.type) {
        case 'confirm_transaction':
            return (
                <ConfirmTransaction
                    installationId={installationId}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    dApp={dApp}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    transactionRequest={internalState.transactionRequest}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                            case 'drag':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'import_keys_button_clicked':
                            case 'on_minimize_click':
                            case 'on_predefined_fee_preset_selected':
                                onMsg(msg)
                                break

                            case 'user_confirmed_transaction_for_signing':
                                setInternalState({
                                    type: 'sign_and_submit_transaction',
                                    keyStore: msg.keyStore,
                                    transactionRequest: msg.transactionRequest,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign_and_submit_transaction':
            return (
                <SignAndSubmit
                    transactionRequest={internalState.transactionRequest}
                    keyStore={internalState.keyStore}
                    sessionPassword={sessionPassword}
                    installationId={installationId}
                    layoutState={state}
                    source={source}
                    accounts={accounts}
                    keystores={keystores}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_with_hw_wallet_cancel_clicked':
                                setInternalState({
                                    type: 'confirm_transaction',
                                    network,
                                    account,
                                    transactionRequest: {
                                        state: 'not_signed',
                                        account,
                                        dApp,
                                        networkHexId: network.hexChainId,
                                        rpcRequest: sendTransactionRequest,
                                    },
                                })
                                break
                            case 'transaction_submited':
                            case 'on_sign_cancel_button_clicked':
                            case 'on_transaction_cancelled_successfully_close_clicked':
                            case 'transaction_cancel_failure_accepted':
                            case 'on_completed_transaction_close_click':
                            case 'transaction_failure_accepted':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_minimize_click':
                            case 'cancel_submitted':
                            case 'on_expand_request':
                            case 'drag':
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
            )

        /* istanbul ignore next */
        default:
            return notReachable(internalState)
    }
}
