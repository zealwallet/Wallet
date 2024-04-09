import { useState } from 'react'

import { components } from '@zeal/api/portfolio'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import {
    SignedUserOperationRequest,
    SubmittedToBundlerUserOperationRequest,
} from '@zeal/domains/TransactionRequest'
import { SimulateTransactionResponse } from '@zeal/domains/Transactions/domains/SimulatedTransaction'

import { MonitorUserOperation } from './MonitorUserOperation'
import { SubmitToBundler } from './SubmitToBundler'

type Props = {
    userOperationRequest: SignedUserOperationRequest
    simulation: SimulateTransactionResponse
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    networkMap: NetworkMap
    keyStore: Safe4337
    installationId: string
    source: components['schemas']['TransactionEventSource']
    visualState: VisualState
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type VisualState = { type: 'minimised' } | { type: 'maximised' }

type Msg =
    | Extract<
          MsgOf<typeof SubmitToBundler>,
          {
              type:
                  | 'on_close_bundler_submission_error_popup'
                  | 'drag'
                  | 'on_expand_request'
          }
      >
    | MsgOf<typeof MonitorUserOperation>

type State =
    | { type: 'submit_to_bundler' }
    | {
          type: 'monitor_user_operation'
          userOperationRequest: SubmittedToBundlerUserOperationRequest
      }

export const SubmitAndMonitor = ({
    userOperationRequest,
    simulation,
    accountsMap,
    keyStoreMap,
    networkMap,
    keyStore,
    source,
    installationId,
    visualState,
    actionSource,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'submit_to_bundler' })

    switch (state.type) {
        case 'submit_to_bundler':
            return (
                <SubmitToBundler
                    installationId={installationId}
                    source={source}
                    accountsMap={accountsMap}
                    keyStore={keyStore}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    userOperationRequest={userOperationRequest}
                    simulation={simulation}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_expand_request':
                            case 'on_minimize_click':
                            case 'on_close_bundler_submission_error_popup':
                                onMsg(msg)
                                break
                            case 'on_user_operation_submitted_to_bundler':
                                setState({
                                    type: 'monitor_user_operation',
                                    userOperationRequest:
                                        msg.userOperationRequest,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'monitor_user_operation':
            return (
                <MonitorUserOperation
                    installationId={installationId}
                    simulation={simulation}
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    userOperationRequest={state.userOperationRequest}
                    visualState={visualState}
                    actionSource={actionSource}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
