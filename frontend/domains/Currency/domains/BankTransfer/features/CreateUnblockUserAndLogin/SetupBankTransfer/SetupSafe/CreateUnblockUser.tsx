import React, { useEffect } from 'react'

import { post } from '@zeal/api/request'

import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { match, object, Result, shape, string } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { CreateUnblockUserParams } from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import { CreateUserForm } from '@zeal/domains/Currency/domains/BankTransfer/components/CreateUserForm'
import { UserEmailAlreadyTaken } from '@zeal/domains/Currency/domains/BankTransfer/components/UserEmailAlreadyTaken'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    account: Account
    network: Network
    keystore: Safe4337
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'unblock_user_created'
          user: CreateUnblockUserParams
          unblockUserId: string
      }
    | Extract<
          MsgOf<typeof UserEmailAlreadyTaken>,
          { type: 'on_try_with_different_wallet_clicked' }
      >

type Params = {
    signal?: AbortSignal
    user: CreateUnblockUserParams
}

const parseUser = (data: unknown): Result<unknown, { unblockUserId: string }> =>
    object(data).andThen((obj) =>
        shape({
            status: match(obj.status, 'CREATED'),
            unblockUserId: string(obj.user_uuid),
        })
    )

const createUnblockUser = async ({
    user,
    signal,
}: Params): Promise<{
    unblockUserId: string
}> => {
    const resp = await post(
        '/wallet/smart-wallet/unblock/',
        {
            body: {
                first_name: user.firstName,
                last_name: user.lastName,
                target_address: user.targetAddress,
                email: user.email,
                country: user.countryCode,
            },
            query: {
                path: '/user',
            },
        },
        signal
    )
    return parseUser(resp).getSuccessResultOrThrow(
        'failed to parse safe user creation response'
    )
}

export const CreateUnblockUser = ({
    account,
    onMsg,
    network,
    keystore,
}: Props) => {
    const [state, setState] = useLazyLoadableData(createUnblockUser)
    const liveOnMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
                liveOnMsg.current({
                    type: 'unblock_user_created',
                    unblockUserId: state.data.unblockUserId,
                    user: state.params.user,
                })
                break

            case 'not_asked':
            case 'loading':
            case 'error':
                break
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    }, [liveOnMsg, state])

    switch (state.type) {
        case 'not_asked':
            return (
                <CreateUserForm
                    keystore={keystore}
                    network={network}
                    account={account}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_create_user_form_submit':
                                setState({
                                    type: 'loading',
                                    params: {
                                        user: msg.form,
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
        case 'loaded':
            return null

        case 'loading':
            return (
                <LoadingLayout
                    onClose={() => onMsg({ type: 'close' })}
                    actionBar={
                        <ActionBar
                            account={account}
                            network={network}
                            keystore={keystore}
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
            const error = parseAppError(state.error)
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
                    {(() => {
                        switch (error.type) {
                            case 'unblock_user_with_such_email_already_exists':
                                return (
                                    <UserEmailAlreadyTaken
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setState({
                                                        type: 'not_asked',
                                                    })
                                                    break

                                                case 'on_try_with_different_wallet_clicked':
                                                    onMsg(msg)
                                                    break

                                                /* istanbul ignore next */
                                                default:
                                                    return notReachable(msg)
                                            }
                                        }}
                                    />
                                )

                            default:
                                return (
                                    <AppErrorPopup
                                        error={error}
                                        onMsg={(msg) => {
                                            switch (msg.type) {
                                                case 'close':
                                                    setState({
                                                        type: 'not_asked',
                                                    })
                                                    break

                                                case 'try_again_clicked':
                                                    setState({
                                                        type: 'loading',
                                                        params: state.params,
                                                    })
                                                    break
                                                /* istanbul ignore next */
                                                default:
                                                    notReachable(msg)
                                            }
                                        }}
                                    />
                                )
                        }
                    })()}
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
