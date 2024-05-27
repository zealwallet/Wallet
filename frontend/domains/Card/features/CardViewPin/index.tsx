import React, { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { GnosisPayAccountOnboardedState } from '@zeal/domains/Card'
import { LockScreenPopup } from '@zeal/domains/Password/features/LockScreenPopup'

import { LoadPin } from './LoadPin'

type Props = {
    encryptedPassword: string
    onMsg: (msg: Msg) => void
    gnosisPayAccountOnboardedState: GnosisPayAccountOnboardedState
}

type Msg = { type: 'close' }

type State =
    | { type: 'password_check' }
    | { type: 'load_pin'; sessionPassword: string }

export const CardViewPin = ({
    encryptedPassword,
    gnosisPayAccountOnboardedState,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'password_check' })

    switch (state.type) {
        case 'password_check':
            return (
                <LockScreenPopup
                    encryptedPassword={encryptedPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'session_password_decrypted':
                                setState({
                                    type: 'load_pin',
                                    sessionPassword: msg.sessionPassword,
                                })
                                break

                            case 'lock_screen_close_click':
                                onMsg({ type: 'close' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'load_pin':
            return (
                <LoadPin
                    gnosisPayAccountOnboardedState={
                        gnosisPayAccountOnboardedState
                    }
                    onMsg={onMsg}
                />
            )

        default:
            notReachable(state)
    }
}
