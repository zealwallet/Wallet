import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConfirmSafetyCheckConnection } from '@zeal/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    state: State
    network: Network
    keyStoreMap: KeyStoreMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof ConfirmSafetyCheckConnection>,
          { type: 'close' | 'confirmation_modal_close_clicked' }
      >
    | {
          type: 'on_zeal_account_connection_request'
          network: Network
          account: Account
      }

export type State =
    | { type: 'closed' }
    | {
          type: 'confirm_safety_checks_modal'
          account: Account
          safetyChecks: ConnectionSafetyCheck[]
      }

export const Modal = ({
    state,
    keyStoreMap,
    network,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_safety_checks_modal':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'confirmation_modal_close_clicked':
                                onMsg(msg)
                                break
                            case 'on_user_confirmed_connection_with_safety_checks':
                                const keystore = getKeyStore({
                                    keyStoreMap,
                                    address: state.account.address,
                                })
                                postUserEvent({
                                    type: 'ConnectionAcceptedEvent',
                                    keystoreType:
                                        keystoreToUserEventType(keystore),
                                    network: network.hexChainId,
                                    installationId,
                                    keystoreId: keystore.id,
                                })
                                onMsg({
                                    type: 'on_zeal_account_connection_request',
                                    account: state.account,
                                    network,
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
