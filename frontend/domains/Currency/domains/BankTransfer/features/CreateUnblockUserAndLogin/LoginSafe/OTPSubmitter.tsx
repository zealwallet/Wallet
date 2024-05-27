import React, { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { submitOTP } from '@zeal/domains/Currency/domains/BankTransfer/api/submitOTP'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { OtpForm } from './OTPForm'

type Props = {
    network: Network
    account: Account
    keystore: Safe4337
    unblockUserId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_unblock_login_success'
          unblockLoginInfo: UnblockLoginInfo
      }

export const OtpSubmitter = ({
    unblockUserId,
    network,
    keystore,
    account,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(submitOTP)

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_unblock_login_success',
                    unblockLoginInfo: loadable.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <OtpForm
                    account={account}
                    keyStore={keystore}
                    network={network}
                    unblockUserId={unblockUserId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_otp_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: { checkOtpRequest: msg.request },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'loaded':
            return null
        case 'loading':
            return (
                <LoadingLayout
                    onClose={() => onMsg({ type: 'close' })}
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={keystore}
                            network={network}
                            left={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />
                    }
                />
            )
        case 'error':
            // TODO :: @Nicvaniek - parse OTP code mismatch error
            const error = parseAppError(loadable.error)
            return (
                <>
                    <LoadingLayout actionBar={null} onClose={null} />
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
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
