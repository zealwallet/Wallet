import { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { UnblockLoginSignature } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    loginToUnblock,
    UnblockLoginInfo,
} from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { EOA } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    account: Account
    keyStore: EOA
    network: Network
    unblockLoginSignature: UnblockLoginSignature
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_unblock_login_success'
          unblockLoginInfo: UnblockLoginInfo
          unblockLoginSignature: UnblockLoginSignature
      }

export const LoginExistingUser = ({
    account,
    unblockLoginSignature,
    keyStore,
    network,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(loginToUnblock, {
        type: 'loading',
        params: unblockLoginSignature,
    })
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_unblock_login_success',
                    unblockLoginInfo: loadable.data,
                    unblockLoginSignature: unblockLoginSignature,
                })
                break

            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [liveOnMsg, loadable, unblockLoginSignature, account])

    switch (loadable.type) {
        case 'loading':
            return (
                <LoadingLayout
                    onClose={() => onMsg({ type: 'close' })}
                    actionBar={
                        <ActionBar
                            account={account}
                            keystore={keyStore}
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
        case 'loaded':
            return null

        case 'error':
            const error = parseAppError(loadable.error)

            return (
                <>
                    <LoadingLayout
                        onClose={() => onMsg({ type: 'close' })}
                        actionBar={
                            <ActionBar
                                account={account}
                                keystore={keyStore}
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
                                    notReachable(msg)
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
