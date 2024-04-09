import React, { useEffect } from 'react'

import { createPasskey } from '@zeal/passkeys'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { getRandomIntArray } from '@zeal/toolkit/Crypto'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { createPasskeyOwner } from '@zeal/domains/KeyStore/helpers/createPasskeyOwner'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'

import { Layout } from './Layout'
import { LoadingLayout } from './LoadingLayout'
import { SuccessLayout } from './SuccessLayout'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    safeLabel: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_passkey_created'
          passkeyOwner: Safe4337['safeDeplymentConfig']['passkeyOwner']
      }

export const createPasskeyCredential = async ({
    network,
    safeLabel,
    sessionPassword,
    networkRPCMap,
}: {
    network: Network
    safeLabel: string
    sessionPassword: string
    networkRPCMap: NetworkRPCMap
}): Promise<Safe4337['safeDeplymentConfig']['passkeyOwner']> => {
    const recoveryIdBuffer = Uint8Array.from(
        getRandomIntArray(new Uint8Array(32)),
        (c) => c
    )

    const response = await createPasskey({
        userName: safeLabel,
        userId: recoveryIdBuffer,
        challenge: getRandomIntArray(new Uint8Array(26)), // Not meaningful during registration,
        rpId: 'sample-associated-domain.web.app',
    })

    return createPasskeyOwner({
        recoveryIdBuffer,
        sessionPassword,
        network,
        networkRPCMap,
        attestationBuffer: response.attestationObject,
    })
}

export const CreatePasskey = ({
    onMsg,
    sessionPassword,
    network,
    safeLabel,
    networkRPCMap,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(createPasskeyCredential)

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_passkey_created',
                    passkeyOwner: loadable.data,
                })
                break
            case 'error':
                const error = parseAppError(loadable.error)
                switch (error.type) {
                    case 'passkey_operation_cancelled':
                        setLoadable({ type: 'not_asked' })
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
    }, [loadable, setLoadable, onMsgLive])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_enable_biometrics_clicked':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        network,
                                        networkRPCMap,
                                        sessionPassword,
                                        safeLabel,
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
            return <LoadingLayout onMsg={onMsg} />
        case 'loaded':
            return <SuccessLayout onMsg={onMsg} />
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
                                            setLoadable({ type: 'not_asked' })
                                            break
                                        case 'try_again_clicked':
                                            setLoadable({
                                                type: 'loading',
                                                params: loadable.params,
                                            })
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg)
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
