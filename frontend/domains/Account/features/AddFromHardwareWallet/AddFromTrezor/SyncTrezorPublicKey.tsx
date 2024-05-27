import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import {
    failure,
    match,
    object,
    oneOf,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { ErrorPopup as TrezorErrorPopup } from '@zeal/domains/Error/domains/Trezor/components/ErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { TREZOR_EXTENDED_PUBLIC_KEY_PATH } from '@zeal/domains/KeyStore/constants'
import { ToServiceWorkerTrezorConnectGetPublicKey } from '@zeal/domains/Main'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_trezor_extended_public_key_synced'
          extendedPublicKey: string
      }

const fetch = async (): Promise<string> => {
    const message: ToServiceWorkerTrezorConnectGetPublicKey = {
        type: 'to_service_worker_trezor_connect_get_public_key',
        coin: 'ETH',
        path: TREZOR_EXTENDED_PUBLIC_KEY_PATH,
    }

    const response: unknown = await chrome.runtime.sendMessage(message)

    const parsed = object(response)
        .andThen((obj) =>
            oneOf(obj, [
                shape({
                    type: match(obj.type, 'Success'),
                    data: string(obj.data),
                }).map(({ data }) => success(data)),
                shape({
                    type: match(obj.type, 'Failure'),
                    reason: success(obj.reason),
                }).map(({ reason }) => failure(reason)),
            ])
        )
        .getSuccessResultOrThrow(
            'Failed to parse trezor_connect_get_public_key response'
        )

    switch (parsed.type) {
        case 'Success':
            return parsed.data
        case 'Failure':
            throw parsed.reason
        default:
            return notReachable(parsed)
    }
}

export const SyncTrezorPublicKey = ({ onMsg }: Props) => {
    const onMsgLive = useLiveRef(onMsg)
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'error':
                break
            case 'loaded':
                onMsgLive.current({
                    type: 'on_trezor_extended_public_key_synced',
                    extendedPublicKey: loadable.data,
                })
                break

            default:
                notReachable(loadable)
        }
    }, [loadable, onMsgLive])

    return (
        <Screen
            background="light"
            padding="form"
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

            <Column shrink spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromTrezor.AccountSelection.title"
                            defaultMessage="Import Trezor wallets"
                        />
                    }
                    onInfoIconClick={noop}
                />

                <Section>
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="AddFromNewSecretPhrase.accounts"
                                    defaultMessage="Wallets"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <Group variant="default">
                        <Column spacing={8}>
                            {(() => {
                                switch (loadable.type) {
                                    case 'loaded':
                                    case 'loading':
                                        return (
                                            <ListItemSkeleton
                                                avatar
                                                shortText
                                            />
                                        )

                                    case 'error':
                                        return (
                                            <>
                                                <ErrorPopup
                                                    error={loadable.error}
                                                    onMsg={(msg) => {
                                                        switch (msg.type) {
                                                            case 'on_sync_trezor_click':
                                                            case 'try_again_clicked':
                                                                setLoadable({
                                                                    type: 'loading',
                                                                    params: loadable.params,
                                                                })

                                                                break

                                                            case 'on_trezor_error_close':
                                                            case 'close':
                                                                onMsg({
                                                                    type: 'close',
                                                                })
                                                                break

                                                            default:
                                                                notReachable(
                                                                    msg
                                                                )
                                                        }
                                                    }}
                                                />
                                                <ListItemSkeleton
                                                    avatar
                                                    shortText
                                                />
                                            </>
                                        )

                                    default:
                                        return notReachable(loadable)
                                }
                            })()}
                        </Column>
                    </Group>
                </Section>
            </Column>
        </Screen>
    )
}

const ErrorPopup = ({
    error,
    onMsg,
}: {
    error: unknown
    onMsg: (
        msg: MsgOf<typeof TrezorErrorPopup> | MsgOf<typeof AppErrorPopup>
    ) => void
}) => {
    const appError = parseAppError(error)

    switch (appError.type) {
        case 'trezor_connection_already_initialized':
        case 'trezor_popup_closed':
        case 'trezor_permissions_not_granted':
        case 'trezor_method_cancelled':
        case 'trezor_action_cancelled':
        case 'trezor_pin_cancelled':
        case 'trezor_device_used_elsewhere':
            return <TrezorErrorPopup error={appError} onMsg={onMsg} />

        default:
            return <AppErrorPopup error={appError} onMsg={onMsg} />
    }
}
