import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { encryptPassword } from '@zeal/domains/Password/helpers/encryptPassword'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { Confirm } from './Confirm'
import { AddForm } from './Form'
import { Success } from './Success'

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
    | { type: 'form'; initialPassword: string }
    | { type: 'confirm'; password: string }
    | { type: 'success'; sessionPassword: string; encryptedPassword: string }

const fetch = async ({ password }: { password: string }) =>
    encryptPassword({ password })

export const AddPassword = ({ installationId, onMsg }: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(fetch)

    const [state, setState] = useState<State>({
        type: 'form',
        initialPassword: '',
    })

    useEffect(() => {
        postUserEvent({
            type: 'PasswordCreationFlowEntered',
            installationId,
        })
    }, [installationId])

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
                break
            case 'loading':
                break
            case 'loaded':
                setState({
                    type: 'success',
                    sessionPassword: loadable.data.sessionPassword,
                    encryptedPassword: loadable.data.encryptedPassword,
                })
                break
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

    switch (state.type) {
        case 'form':
            return (
                <AddForm
                    initialPassword={state.initialPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'password_added':
                                setState({
                                    type: 'confirm',
                                    password: msg.password,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'confirm':
            return (
                <Confirm
                    isPending={loadable.type === 'loading'}
                    password={state.password}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({
                                    type: 'form',
                                    initialPassword: state.password,
                                })
                                break
                            case 'password_confirmed':
                                postUserEvent({
                                    type: 'PasswordConfirmedEvent',
                                    installationId,
                                })
                                setLoadable({
                                    type: 'loading',
                                    params: { password: msg.password },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'success':
            return (
                <Success
                    onSuccess={() => {
                        onMsg({
                            type: 'password_added',
                            encryptedPassword: state.encryptedPassword,
                            sessionPassword: state.sessionPassword,
                        })
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
