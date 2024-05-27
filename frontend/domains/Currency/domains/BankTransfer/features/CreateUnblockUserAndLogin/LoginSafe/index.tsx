import React from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { requestOTP } from '@zeal/domains/Currency/domains/BankTransfer/api/requestOTP'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { OtpSubmitter } from './OTPSubmitter'

type Props = {
    account: Account
    keystore: Safe4337
    network: Network
    unblockUserId: string
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof OtpSubmitter>

export const LoginSafe = ({
    unblockUserId,
    network,
    account,
    keystore,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(requestOTP, {
        type: 'loading',
        params: {
            unblockUserId,
        },
    })
    switch (loadable.type) {
        case 'loaded':
            return (
                <OtpSubmitter
                    network={network}
                    account={account}
                    keystore={keystore}
                    unblockUserId={unblockUserId}
                    onMsg={onMsg}
                />
            )
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
