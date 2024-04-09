import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { NetworkMap } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { SignMessageSimulationResponse } from '@zeal/domains/RPCRequest/domains/SignMessageSimulation'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    dApp: DAppSiteInfo
    installationId: string
    account: Account
    keyStore: KeyStore
    simulationResponse: SignMessageSimulationResponse
    request: SignMessageRequest
    state: State
    isLoading: boolean
    networkMap: NetworkMap
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Layout>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'cancel_button_click'
                  | 'sign_click'
                  | 'on_minimize_click'
          }
      >
    | Extract<
          MsgOf<typeof Modal>,
          {
              type: 'on_edit_permit_allowance_form_submitted' | 'sign_click'
          }
      >
    | MsgOf<typeof ConnectedMinimized>

export type State =
    | {
          type: 'minimised'
      }
    | {
          type: 'maximised'
      }

export const Simulation = ({
    dApp,
    keyStore,
    account,
    simulationResponse,
    isLoading,
    request,
    networkMap,
    state,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    const nowTimestampMs = useCurrentTimestamp({ refreshIntervalMs: 1000 })
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    switch (state.type) {
        case 'minimised':
            return (
                <ConnectedMinimized
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )
        case 'maximised':
            return (
                <>
                    <Layout
                        nowTimestampMs={nowTimestampMs}
                        account={account}
                        request={request}
                        isLoading={isLoading}
                        keyStore={keyStore}
                        dApp={dApp}
                        networkMap={networkMap}
                        actionSource={actionSource}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'import_keys_button_clicked':
                                case 'cancel_button_click':
                                case 'on_minimize_click':
                                case 'sign_click':
                                    onMsg(msg)
                                    break

                                case 'on_permit_info_icon_clicked':
                                    setModal({ type: 'permit_info' })
                                    break

                                case 'on_spend_limit_info_icon_clicked':
                                    setModal({ type: 'spend_limit_info' })
                                    break

                                case 'on_expiration_info_icon_clicked':
                                    setModal({ type: 'expiration_info' })
                                    break

                                case 'on_safety_checks_clicked':
                                    setModal({ type: 'safety_checks_popup' })
                                    break

                                case 'on_user_confirmation_requested':
                                    setModal({
                                        type: 'user_confirmation',
                                        failedSafetyChecks:
                                            msg.failedSafetyChecks,
                                        keyStore: msg.keyStore,
                                    })
                                    break
                                case 'on_spend_limit_warning_click':
                                    setModal({
                                        type: 'high_spend_limit_warning',
                                    })
                                    break
                                case 'on_editing_locked_click':
                                    setModal({ type: 'editing_locked_popup' })
                                    break

                                case 'on_expiration_time_warning_click':
                                    setModal({
                                        type: 'high_expiration_warning',
                                    })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                        simulationResponse={simulationResponse}
                    />

                    <Modal
                        request={request}
                        isLoading={isLoading}
                        state={modal}
                        simulationResponse={simulationResponse}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'sign_click':
                                    onMsg(msg)
                                    break

                                case 'close':
                                    setModal({ type: 'closed' })
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
