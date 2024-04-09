import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Pin } from '@zeal/domains/Password'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { ConfirmPin } from './ConfirmPin'
import { CreatePin } from './CreatePin'
import { SavePinToSecureStorage } from './SavePinToSecureStorage'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'password_added'
          sessionPassword: string
          encryptedPassword: string
      }
    | { type: 'close' }

type State =
    | { type: 'create_pin' }
    | { type: 'confirm_pin'; createdPin: Pin }
    | {
          type: 'save_pin_to_secure_storage'
          pin: Pin
          sessionPassword: string
          encryptedPassword: string
      }

export const AddPin = ({ installationId, onMsg }: Props) => {
    const [state, setState] = useState<State>({ type: 'create_pin' })

    useEffect(() => {
        // TODO :: @Nicvaniek add platform to event?
        postUserEvent({
            type: 'PasswordCreationFlowEntered',
            installationId,
        })
    }, [installationId])

    switch (state.type) {
        case 'create_pin':
            return (
                <CreatePin
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'pin_created':
                                setState({
                                    type: 'confirm_pin',
                                    createdPin: msg.pin,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'confirm_pin':
            return (
                <ConfirmPin
                    createdPin={state.createdPin}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'create_pin' })
                                break
                            case 'pin_confirmed':
                                setState({
                                    type: 'save_pin_to_secure_storage',
                                    pin: msg.pin,
                                    sessionPassword: msg.sessionPassword,
                                    encryptedPassword: msg.encryptedPassword,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'save_pin_to_secure_storage':
            return (
                <SavePinToSecureStorage
                    pin={state.pin}
                    sessionPassword={state.sessionPassword}
                    encryptedPassword={state.encryptedPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
