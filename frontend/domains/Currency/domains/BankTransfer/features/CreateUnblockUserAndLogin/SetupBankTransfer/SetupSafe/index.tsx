import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CreateUnblockUserParams } from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { TryToRestoreUnblockInfo } from './TryToRestoreUnblockInfo'

import { LoginSafe } from '../../LoginSafe'

type Props = {
    keystore: Safe4337
    account: Account
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_unblock_login_success_after_restore'
          unblockLoginInfo: UnblockLoginInfo
      }
    | {
          type: 'on_unblock_login_success_after_create'
          unblockLoginInfo: UnblockLoginInfo
          user: CreateUnblockUserParams
      }
    | Extract<
          MsgOf<typeof TryToRestoreUnblockInfo>,
          { type: 'on_try_with_different_wallet_clicked' }
      >

type State =
    | { type: 'try_to_restore_unblock_info' }
    | {
          type: 'login_user_after_restore'
          unblockUserId: string
      }
    | {
          type: 'login_user_after_create'
          unblockUserId: string
          user: CreateUnblockUserParams
      }

export const SetupSafe = ({ account, network, keystore, onMsg }: Props) => {
    const [state, setState] = useState<State>({
        type: 'try_to_restore_unblock_info',
    })
    switch (state.type) {
        case 'try_to_restore_unblock_info':
            return (
                <TryToRestoreUnblockInfo
                    account={account}
                    network={network}
                    keystore={keystore}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_try_with_different_wallet_clicked':
                                onMsg(msg)
                                break
                            case 'unblock_user_restored':
                                setState({
                                    type: 'login_user_after_restore',
                                    unblockUserId: msg.unblockUserId,
                                })
                                break
                            case 'unblock_user_created':
                                setState({
                                    type: 'login_user_after_create',
                                    unblockUserId: msg.unblockUserId,
                                    user: msg.user,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'login_user_after_restore':
            return (
                <LoginSafe
                    network={network}
                    account={account}
                    keystore={keystore}
                    unblockUserId={state.unblockUserId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_unblock_login_success':
                                onMsg({
                                    type: 'on_unblock_login_success_after_restore',
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'login_user_after_create':
            return (
                <LoginSafe
                    network={network}
                    account={account}
                    keystore={keystore}
                    unblockUserId={state.unblockUserId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_unblock_login_success':
                                onMsg({
                                    type: 'on_unblock_login_success_after_create',
                                    unblockLoginInfo: msg.unblockLoginInfo,
                                    user: state.user,
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
