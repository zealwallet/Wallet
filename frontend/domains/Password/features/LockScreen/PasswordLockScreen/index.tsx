import React, { useEffect } from 'react'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { decryptPassword } from '@zeal/domains/Password/helpers/decryptPassword'

import { Layout } from './Layout'

type Props = {
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'session_password_decrypted'; sessionPassword: string }
    | { type: 'lock_screen_close_click' }

export const PasswordLockScreen = ({ onMsg, encryptedPassword }: Props) => {
    const [state, setState] = useLazyLoadableData(decryptPassword)
    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveMsg.current({
                    type: 'session_password_decrypted',
                    sessionPassword: state.data.sessionPassword,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [state, liveMsg])

    switch (state.type) {
        case 'not_asked':
            return (
                <Layout
                    error={null}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'lock_screen_close_click' })
                                break
                            case 'user_password_submitted':
                                setState({
                                    type: 'loading',
                                    params: {
                                        userPassword: msg.userPassword,
                                        encrypted: encryptedPassword,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loading':
            return <Layout error={null} onMsg={noop} />
        case 'loaded':
            return null
        case 'error':
            return (
                <Layout
                    error={{ type: 'password_incorrect' }}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'lock_screen_close_click' })
                                break
                            case 'user_password_submitted':
                                setState({
                                    type: 'loading',
                                    params: {
                                        userPassword: msg.userPassword,
                                        encrypted: encryptedPassword,
                                    },
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
