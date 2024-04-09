import { useEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import {
    UserOperationHash,
    UserOperationWithoutSignature,
    UserOperationWithSignature,
} from '@zeal/domains/UserOperation'
import { signUserOperationHashWithPassKey } from '@zeal/domains/UserOperation/helpers/signUserOperationHashWithPassKey'

import { LoadingLayout } from '../LoadingLayout'

type Props = {
    passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
    sessionPassword: string
    userOperationWithoutSignature: UserOperationWithoutSignature
    userOperationHash: UserOperationHash
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_user_operation_signed'
          userOperationWithSignature: UserOperationWithSignature
      }
    | { type: 'on_passkey_modal_close' }

export const Sign = ({
    onMsg,
    userOperationHash,
    userOperationWithoutSignature,
    sessionPassword,
    passkey,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(
        signUserOperationHashWithPassKey,
        {
            type: 'loading',
            params: {
                passkey,
                sessionPassword,
                userOperationHash,
            },
        }
    )

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_user_operation_signed',
                    userOperationWithSignature: {
                        ...userOperationWithoutSignature,
                        type: 'user_operation_with_signature',
                        signature: loadable.data,
                    },
                })
                break
            case 'error':
                const error = parseAppError(loadable.error)
                switch (error.type) {
                    case 'passkey_operation_cancelled':
                        onMsgLive.current({ type: 'on_passkey_modal_close' })
                        break
                    /* istanbul ignore next */
                    default:
                        break
                }
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive, userOperationWithoutSignature])

    switch (loadable.type) {
        case 'loading':
        case 'loaded':
            return <LoadingLayout onMsg={onMsg} />
        case 'error':
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'passkey_operation_cancelled':
                    return null
                /* istanbul ignore next */
                default:
                    return (
                        <>
                            <LoadingLayout onMsg={onMsg} />
                            <AppErrorPopup
                                error={error}
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg(msg)
                                            break

                                        case 'try_again_clicked':
                                            setLoadable({
                                                type: 'loading',
                                                params: loadable.params,
                                            })
                                            break

                                        default:
                                            notReachable(msg)
                                    }
                                }}
                            />
                        </>
                    )
            }
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
