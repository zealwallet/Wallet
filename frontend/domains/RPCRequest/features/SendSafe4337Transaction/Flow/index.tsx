import { useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ConstructUserOperation } from '@zeal/domains/RPCRequest/features/SendSafe4337Transaction/Flow/ConstructUserOperation'
import {
    SignedUserOperationRequest,
    SimulatedUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import {
    GasAbstractionTransactionFee,
    UserOperationWithoutSignature,
} from '@zeal/domains/UserOperation'

import { Confirm } from './Confirm'
import { SignUserOperation } from './SignUserOperation'
import { SubmitAndMonitor } from './SubmitAndMonitor'

type Props = {
    keyStore: Safe4337
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    rpcRequestToBundle: EthSendTransaction
    portfolio: Portfolio | null
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    dAppInfo: DAppSiteInfo | null
    state: VisualState
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    source: components['schemas']['TransactionEventSource']
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | Extract<
          MsgOf<typeof Confirm>,
          {
              type:
                  | 'drag'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_expand_request'
                  | 'on_4337_gas_currency_selected'
                  | 'on_minimize_click'
          }
      >
    | Extract<
          MsgOf<typeof SubmitAndMonitor>,
          {
              type:
                  | 'on_minimize_click'
                  | 'on_completed_safe_transaction_close_click'
                  | 'on_safe_transaction_failure_accepted'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
          }
      >

type State =
    | { type: 'confirm' }
    | {
          type: 'construct_user_operation'
          selectedFee: GasAbstractionTransactionFee
          userOperationRequest: SimulatedUserOperationRequest
          simulation: SimulateTransactionResponse
      }
    | {
          type: 'sign'
          userOperationWithoutSignature: UserOperationWithoutSignature
          userOperationRequest: SimulatedUserOperationRequest
          simulation: SimulateTransactionResponse
      }
    | {
          type: 'submit_and_monitor'
          userOperationRequest: SignedUserOperationRequest
          simulation: SimulateTransactionResponse
      }

export const Flow = ({
    onMsg,
    keyStore,
    networkRPCMap,
    sessionPassword,
    rpcRequestToBundle,
    network,
    account,
    accountsMap,
    networkMap,
    keyStoreMap,
    dAppInfo,
    portfolio,
    state: visualState,
    gasCurrencyPresetMap,
    source,
    actionSource,
    installationId,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'confirm' })

    switch (state.type) {
        case 'confirm':
            return (
                <Confirm
                    installationId={installationId}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    state={visualState}
                    sessionPassword={sessionPassword}
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    keyStore={keyStore}
                    account={account}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    dAppInfo={dAppInfo}
                    rpcRequestToBundle={rpcRequestToBundle}
                    portfolio={portfolio}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_minimize_click':
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_4337_gas_currency_selected':
                                onMsg(msg)
                                break
                            case 'on_submit_click':
                            case 'on_user_confirmed_transaction_for_signing':
                                setState({
                                    type: 'construct_user_operation',
                                    selectedFee: msg.selectedFee,
                                    userOperationRequest:
                                        msg.userOperationRequest,
                                    simulation: msg.simulation,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'construct_user_operation':
            return (
                <ConstructUserOperation
                    selectedFee={state.selectedFee}
                    userOperationRequest={state.userOperationRequest}
                    simulation={state.simulation}
                    visualState={visualState}
                    actionSource={actionSource}
                    installationId={installationId}
                    networkRPCMap={networkRPCMap}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_expand_request':
                            case 'drag':
                            case 'on_minimize_click':
                                onMsg(msg)
                                break
                            case 'close':
                                setState({ type: 'confirm' })
                                break
                            case 'on_user_operation_constructed':
                                setState({
                                    type: 'sign',
                                    userOperationRequest:
                                        state.userOperationRequest,
                                    simulation: state.simulation,
                                    userOperationWithoutSignature:
                                        msg.userOperation,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign':
            return (
                <SignUserOperation
                    installationId={installationId}
                    userOperationRequest={state.userOperationRequest}
                    userOperationWithoutSignature={
                        state.userOperationWithoutSignature
                    }
                    simulation={state.simulation}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    keyStore={keyStore}
                    visualState={visualState}
                    actionSource={actionSource}
                    networkMap={networkMap}
                    keyStoreMap={keyStoreMap}
                    accountsMap={accountsMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_minimize_click':
                                onMsg(msg)
                                break
                            case 'close':
                            case 'on_passkey_modal_close':
                                setState({ type: 'confirm' })
                                break
                            case 'on_safe_transaction_signed':
                                setState({
                                    type: 'submit_and_monitor',
                                    userOperationRequest:
                                        msg.userOperationRequest,
                                    simulation: state.simulation,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_and_monitor':
            return (
                <SubmitAndMonitor
                    source={source}
                    installationId={installationId}
                    simulation={state.simulation}
                    accountsMap={accountsMap}
                    keyStore={keyStore}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    userOperationRequest={state.userOperationRequest}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_minimize_click':
                            case 'on_completed_safe_transaction_close_click':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                onMsg(msg)
                                break
                            case 'on_close_bundler_submission_error_popup':
                                setState({
                                    type: 'confirm',
                                })
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
            return notReachable(state)
    }
}
