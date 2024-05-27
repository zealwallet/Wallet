import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { CardViewPin } from '@zeal/domains/Card/features/CardViewPin'
import { NotificationPermission } from '@zeal/domains/Notification'

import { CardNotificationsSettings } from './CardNotificationsSettings'

type Props = {
    state: State
    accountsMap: AccountsMap
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'view_pin' }
    | { type: 'closed' }
    | {
          type: 'card_notifications_settings'
          notificationPermission: NotificationPermission
      }

type Msg = { type: 'close' } | MsgOf<typeof CardNotificationsSettings>

export const Modal = ({
    state,
    gnosisPayAccountOnboardedState,
    encryptedPassword,
    accountsMap,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'view_pin':
            return (
                <UIModal>
                    <CardViewPin
                        gnosisPayAccountOnboardedState={
                            gnosisPayAccountOnboardedState
                        }
                        onMsg={onMsg}
                        encryptedPassword={encryptedPassword}
                    />
                </UIModal>
            )
        case 'card_notifications_settings':
            return (
                <UIModal>
                    <CardNotificationsSettings
                        notificationPermission={state.notificationPermission}
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'closed':
            return null

        default:
            notReachable(state)
    }
}
