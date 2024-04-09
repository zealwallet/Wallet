import { FormattedMessage } from 'react-intl'

import { signWithPasskey } from '@zeal/passkeys'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineFingerprint } from '@zeal/uikit/Icon/OutlineFingerprint'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout } from '@zeal/uikit/LoadingLayout'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { encrypt, getRandomIntArray } from '@zeal/toolkit/Crypto'
import * as Hexadecimal from '@zeal/toolkit/Hexadecimal'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'

import { RestoreSafe } from './RestoreSafe'

type Props = {
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    network: Network
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof RestoreSafe>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_account_create_request'
          }
      >

const getPasskey = async ({
    sessionPassword,
}: {
    sessionPassword: string
}): Promise<{
    encryptedCredentialId: Safe4337['safeDeplymentConfig']['passkeyOwner']['encryptedCredentialId']
    recoveryId: Safe4337['safeDeplymentConfig']['passkeyOwner']['recoveryId']
}> => {
    const { credentialId, userId } = await signWithPasskey({
        challenge: getRandomIntArray(new Uint8Array(26)),
        rpId: 'sample-associated-domain.web.app',
        allowedCredentials: [],
    })

    const encryptedCredentialId = await encrypt(
        sessionPassword,
        Hexadecimal.fromBuffer(credentialId)
    )

    return {
        encryptedCredentialId,
        recoveryId: Hexadecimal.fromBuffer(userId),
    }
}

export const Add4337SafeFromPasskey = ({
    onMsg,
    sessionPassword,
    networkRPCMap,
    network,
    accountsMap,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(getPasskey)

    switch (loadable.type) {
        case 'not_asked':
            return (
                <Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_continue_click':
                                setLoadable({
                                    type: 'loading',
                                    params: { sessionPassword },
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
            return (
                <LoadingLayout
                    actionBar={
                        <ActionBar
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
            return (
                <RestoreSafe
                    network={network}
                    encryptedCredentialId={loadable.data.encryptedCredentialId}
                    recoveryId={loadable.data.recoveryId}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setLoadable({ type: 'not_asked' })
                                break
                            case 'on_try_different_passkey_click':
                                setLoadable({
                                    type: 'loading',
                                    params: { sessionPassword },
                                })
                                break
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'error':
            const error = parseAppError(loadable.error)

            switch (error.type) {
                case 'passkey_operation_cancelled':
                    return (
                        <Layout
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break
                                    case 'on_continue_click':
                                        setLoadable({
                                            type: 'loading',
                                            params: { sessionPassword },
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
                        <>
                            <Layout
                                onMsg={(msg) => {
                                    switch (msg.type) {
                                        case 'close':
                                            onMsg(msg)
                                            break
                                        case 'on_continue_click':
                                            setLoadable({
                                                type: 'loading',
                                                params: { sessionPassword },
                                            })
                                            break
                                        /* istanbul ignore next */
                                        default:
                                            return notReachable(msg)
                                    }
                                }}
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

type LayoutProps = {
    onMsg: (msg: LayoutMsg) => void
}
type LayoutMsg = { type: 'close' } | { type: 'on_continue_click' }

const Layout = ({ onMsg }: LayoutProps) => (
    <Screen padding="form" background="light">
        <ActionBar
            left={
                <IconButton
                    variant="on_light"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    {({ color }) => <BackIcon size={24} color={color} />}
                </IconButton>
            }
        />
        <Column spacing={0} fill>
            <Header
                title={
                    <FormattedMessage
                        id="passkey-recovery.select-passkey.title"
                        defaultMessage="Select passkey"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="passkey-recovery.select-passkey.subtitle"
                        defaultMessage="Your device will prompt you to select the passkey associated with your wallet. If you don’t see your wallet's passkey then make sure you’re logged into the correct account. Passkeys are account specific."
                    />
                }
                icon={({ size, color }) => (
                    <OutlineFingerprint size={size} color={color} />
                )}
            />
        </Column>
        <Actions>
            <Button
                variant="primary"
                size="regular"
                onClick={() => onMsg({ type: 'on_continue_click' })}
            >
                <FormattedMessage
                    id="passkey-recovery.select-passkey.continue"
                    defaultMessage="Continue"
                />
            </Button>
        </Actions>
    </Screen>
)
