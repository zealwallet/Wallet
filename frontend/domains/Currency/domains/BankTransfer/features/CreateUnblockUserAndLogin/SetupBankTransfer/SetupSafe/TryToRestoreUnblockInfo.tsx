import { useEffect } from 'react'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { restoreUnblockUserFromSafe } from '@zeal/domains/Currency/domains/BankTransfer/api/restoreUnblockUserFromSafe'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { CreateUnblockUser } from './CreateUnblockUser'

type Props = {
    keystore: Safe4337
    account: Account
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'unblock_user_restored'; unblockUserId: string }
    | Extract<
          MsgOf<typeof CreateUnblockUser>,
          {
              type:
                  | 'on_try_with_different_wallet_clicked'
                  | 'unblock_user_created'
          }
      >

export const TryToRestoreUnblockInfo = ({
    keystore,
    network,
    onMsg,
    account,
}: Props) => {
    const [state, setState] = useLoadableData(restoreUnblockUserFromSafe, {
        type: 'loading',
        params: {
            keystore,
        },
    })
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
                switch (state.data.type) {
                    case 'unblock_user_restored':
                        liveOnMsg.current(state.data)
                        break
                    case 'user_not_found':
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(state.data)
                }
                break
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveOnMsg, state])

    switch (state.type) {
        case 'loading':
            return (
                <LoadingLayout
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
            return (
                <>
                    <LoadingLayout
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
                        error={parseAppError(state.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break
                                case 'try_again_clicked':
                                    setState({
                                        type: 'loading',
                                        params: state.params,
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
        case 'loaded': {
            const { data } = state
            switch (data.type) {
                case 'user_not_found':
                    return (
                        <CreateUnblockUser
                            network={network}
                            account={account}
                            keystore={keystore}
                            onMsg={onMsg}
                        />
                    )
                case 'unblock_user_restored':
                    return null
                /* istanbul ignore next */
                default:
                    return notReachable(data)
            }
        }

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
