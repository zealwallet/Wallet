import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { OutlineFingerprint } from '@zeal/uikit/Icon/OutlineFingerprint'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout as UILoadingLayout } from '@zeal/uikit/LoadingLayout'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { useLazyLoadableData } from '@zeal/toolkit/LoadableData/LazyLoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AccountsMap } from '@zeal/domains/Account'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { SignWithPasskeyPopup } from '@zeal/domains/KeyStore/domains/Passkey/components/SignWithPasskeyPopup'
import { getPasskeyId } from '@zeal/domains/KeyStore/domains/Passkey/helpers/getPasskeyId'
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

export const Add4337SafeFromPasskey = ({
    onMsg,
    sessionPassword,
    networkRPCMap,
    network,
    accountsMap,
}: Props) => {
    const [loadable, setLoadable] = useLazyLoadableData(getPasskeyId)

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
            return <LoadingLayout onMsg={onMsg} />
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
    <Screen
        padding="form"
        background="light"
        onNavigateBack={() => onMsg({ type: 'close' })}
    >
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

const LoadingLayout = ({
    onMsg,
}: {
    onMsg: (msg: { type: 'close' }) => void
}) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <UILoadingLayout
                    onClose={() => onMsg({ type: 'close' })}
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
        case 'web':
            return (
                <>
                    <UILoadingLayout
                        onClose={() => onMsg({ type: 'close' })}
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
                    <SignWithPasskeyPopup onMsg={onMsg} />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
