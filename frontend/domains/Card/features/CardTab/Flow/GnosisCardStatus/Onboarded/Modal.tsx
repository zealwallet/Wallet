import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { CardAddCash } from '@zeal/domains/Card/features/CardAddCash'
import { CardSettings } from '@zeal/domains/Card/features/CardSettings'
import { LockScreenPopup } from '@zeal/domains/Password/features/LockScreenPopup'

type Props = {
    state: State
    accountsMap: AccountsMap
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
    encryptedPassword: string
    installationId: string
    onMsg: (msg: Msg) => void
}

export type State =
    | { type: 'closed' }
    | { type: 'card_settings' }
    | { type: 'lock_screen_popup' }
    | { type: 'add_cash' }

type Msg = { type: 'close' } | MsgOf<typeof LockScreenPopup>

export const Modal = ({
    gnosisPayAccountOnboardedState,
    encryptedPassword,
    state,
    accountsMap,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'card_settings':
            return (
                <UIModal>
                    <CardSettings
                        accountsMap={accountsMap}
                        onMsg={onMsg}
                        gnosisPayAccountOnboardedState={
                            gnosisPayAccountOnboardedState
                        }
                        encryptedPassword={encryptedPassword}
                    />
                </UIModal>
            )
        case 'add_cash':
            return (
                <UIModal>
                    <CardAddCash
                        installationId={installationId}
                        gnosisPayAccountOnboardedState={
                            gnosisPayAccountOnboardedState
                        }
                        onMsg={onMsg}
                    />
                </UIModal>
            )

        case 'lock_screen_popup':
            return (
                <LockScreenPopup
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )

        default:
            notReachable(state)
    }
}
