import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SecretPhrase } from '@zeal/domains/KeyStore'
import { restoreBackup } from '@zeal/domains/KeyStore/helpers/backup'

import { Layout } from './Layout'

import { FileCorrupted } from '../FileCorrupted'

type Props = {
    file: {
        id: string
        name: string
        modifiedTime: number
        encryptedContent: string
    }

    sessionPassword: string
    accounts: AccountsMap

    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_accounts_create_success_animation_finished' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

export const DecryptBackup = ({
    file,
    sessionPassword,
    accounts,
    onMsg,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)
    const [loadable, setLoadable] = useLazyLoadableData(restoreBackup, {
        type: 'not_asked',
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                liveMsg.current({
                    type: 'on_account_create_request',
                    accountsWithKeystores: [loadable.data],
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, liveMsg])

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Layout
                    error={null}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'user_password_submitted':
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        file,
                                        unencryptedUserPassword:
                                            msg.userPassword,
                                        sessionPassword,
                                        accounts,
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
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="add.account.backup.decrypt.success"
                            defaultMessage="Wallet restored"
                        />
                    }
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                        })
                    }
                />
            )
        case 'error':
            const parsed = parseAppError(loadable.error)

            switch (parsed.type) {
                case 'invalid_encrypted_file_format':
                case 'encrypted_object_invalid_format':
                    return (
                        <FileCorrupted
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg.type)
                                }
                            }}
                        />
                    )

                case 'decrypt_incorrect_password':
                    return (
                        <Layout
                            error={{ type: 'password_incorrect' }}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'user_password_submitted':
                                        setLoadable({
                                            type: 'loading',
                                            params: {
                                                unencryptedUserPassword:
                                                    msg.userPassword,
                                                file,
                                                sessionPassword,
                                                accounts,
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
                    return (
                        <AppErrorPopup
                            error={parsed}
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
                    )
            }

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
