import { useEffect } from 'react'

import { patch } from '@zeal/api/request'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    loginInfo: UnblockLoginInfo
    keystore: SigningKeyStore
    account: Account
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_user_preferences_set_successfully' }

// TODO :: @Nicvaniek remove this -> Unblock v2.0.4 allows us to set this when creating a new user
const setPreferences = async ({
    loginInfo,
    signal,
}: {
    loginInfo: UnblockLoginInfo
    signal?: AbortSignal
}): Promise<void> =>
    Promise.all([
        patch(
            '/wallet/smart-wallet/unblock/',
            {
                body: {
                    currency: 'EUR',
                    chain: 'polygon',
                    token: 'usdce',
                },
                query: {
                    path: '/user/token-preferences',
                },
                auth: {
                    type: 'session_id',
                    sessionId: loginInfo.unblockSessionId,
                },
            },
            signal
        ),
        patch(
            '/wallet/smart-wallet/unblock/',
            {
                body: {
                    currency: 'GBP',
                    chain: 'polygon',
                    token: 'usdce',
                },
                query: {
                    path: '/user/token-preferences',
                },
                auth: {
                    type: 'session_id',
                    sessionId: loginInfo.unblockSessionId,
                },
            },
            signal
        ),
    ]).then(() => undefined)
export const SetUserPreferences = ({
    loginInfo,
    onMsg,
    account,
    network,
    keystore,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(setPreferences, {
        type: 'loading',
        params: {
            loginInfo,
        },
    })

    const onMsgLive = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_user_preferences_set_successfully',
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    switch (loadable.type) {
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
        case 'loaded':
            return null
        case 'error':
            return (
                <>
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
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
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
