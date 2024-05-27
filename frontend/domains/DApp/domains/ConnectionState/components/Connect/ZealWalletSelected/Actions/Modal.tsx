import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { ConnectionSafetyCheck } from '@zeal/domains/SafetyCheck'
import { ConfirmSafetyCheckConnection } from '@zeal/domains/SafetyCheck/components/ConfirmSafetyCheckConnection'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    state: State
    network: Network
    keystore: KeyStore
    installationId: string
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'confirm_connection'; safetyChecks: ConnectionSafetyCheck[] }

export type Msg = MsgOf<typeof ConfirmSafetyCheckConnection>

export const Modal = ({
    state,
    network,
    keystore,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'confirm_connection':
            return (
                <ConfirmSafetyCheckConnection
                    safetyChecks={state.safetyChecks}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'confirmation_modal_close_clicked':
                                onMsg(msg)
                                break
                            case 'on_user_confirmed_connection_with_safety_checks':
                                postUserEvent({
                                    type: 'ConnectionAcceptedEvent',
                                    keystoreType:
                                        keystoreToUserEventType(keystore),
                                    network: network.hexChainId,
                                    installationId,
                                    keystoreId: keystore.id,
                                })
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
