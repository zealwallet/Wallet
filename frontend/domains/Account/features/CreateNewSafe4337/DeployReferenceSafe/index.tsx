import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { ConstructUserOperation } from '@zeal/domains/Account/features/CreateNewSafe4337/DeployReferenceSafe/ConstructUserOperation'
import { SignUserOperation } from '@zeal/domains/Account/features/CreateNewSafe4337/DeployReferenceSafe/SignUserOperation'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import {
    UserOperationWithoutSignature,
    UserOperationWithSignature,
} from '@zeal/domains/UserOperation'

import { SubmitUserOperation } from './SubmitUserOperation'

type Props = {
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    label: string
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | MsgOf<typeof SubmitUserOperation>
    | Extract<
          MsgOf<typeof SignUserOperation>,
          { type: 'on_passkey_modal_close' }
      >

type State =
    | { type: 'construct_user_operation' }
    | {
          type: 'sign_user_operation'
          keyStore: Safe4337
          userOperationWithoutSignature: UserOperationWithoutSignature
      }
    | {
          type: 'submit_user_operation'
          keyStore: Safe4337
          userOperationWithSignature: UserOperationWithSignature
      }

export const DeployReferenceSafe = ({
    network,
    networkRPCMap,
    passkey,
    sessionPassword,
    onMsg,
    label,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'construct_user_operation',
    })

    switch (state.type) {
        case 'construct_user_operation':
            return (
                <ConstructUserOperation
                    sessionPassword={sessionPassword}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    passkey={passkey}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_user_operation_constructed':
                                setState({
                                    type: 'sign_user_operation',
                                    userOperationWithoutSignature:
                                        msg.userOperationWithoutSignature,
                                    keyStore: msg.keyStore,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign_user_operation':
            return (
                <SignUserOperation
                    userOperationWithoutSignature={
                        state.userOperationWithoutSignature
                    }
                    network={network}
                    passkey={passkey}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_passkey_modal_close':
                                onMsg(msg)
                                break
                            case 'on_user_operation_signed':
                                setState({
                                    type: 'submit_user_operation',
                                    userOperationWithSignature:
                                        msg.userOperationWithSignature,
                                    keyStore: state.keyStore,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_user_operation':
            return (
                <SubmitUserOperation
                    userOperationWithSignature={
                        state.userOperationWithSignature
                    }
                    keyStore={state.keyStore}
                    label={label}
                    network={network}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
