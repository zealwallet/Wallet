import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldCrossSquare } from '@zeal/uikit/Icon/BoldCrossSquare'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldDisconnected } from '@zeal/uikit/Icon/BoldDisconnected'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { Title } from '@zeal/domains/Error/components/Title'
import { TrezorError } from '@zeal/domains/Error/domains/Trezor'

type Props = {
    error: TrezorError
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_trezor_error_close' }
    | { type: 'on_sync_trezor_click' }

export const ErrorPopup = ({ error, onMsg }: Props) => {
    switch (error.type) {
        case 'trezor_connection_already_initialized':
            return (
                <AppErrorPopup
                    error={error}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break

                            case 'try_again_clicked':
                                onMsg({ type: 'on_sync_trezor_click' })
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'trezor_popup_closed':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldDisconnected
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_popup_closed.subtitle"
                                defaultMessage="The Trezor dialogue closed unexpectedly"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({ type: 'on_sync_trezor_click' })
                            }
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_popup_closed.action"
                                defaultMessage="Sync Trezor"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'trezor_permissions_not_granted':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldDisconnected
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_permissions_not_granted.subtitle"
                                defaultMessage="Please give Zeal permissions to see all wallets"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_trezor_click' })
                            }}
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_permissions_not_granted.action"
                                defaultMessage="Sync Trezor"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'trezor_method_cancelled':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldDisconnected
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_method_cancelled.subtitle"
                                defaultMessage="Make sure to allow Trezor to export wallets to Zeal"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_trezor_click' })
                            }}
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_method_cancelled.action"
                                defaultMessage="Sync Trezor"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'trezor_action_cancelled':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldCrossSquare
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_action_cancelled.subtitle"
                                defaultMessage="You rejected the transaction on your hardware wallet"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() =>
                                onMsg({ type: 'on_trezor_error_close' })
                            }
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_action_cancelled.action"
                                defaultMessage="Close"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'trezor_pin_cancelled':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldDisconnected
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_pin_cancelled.subtitle"
                                defaultMessage="Session canceled on the device"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_trezor_click' })
                            }}
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_pin_cancelled.action"
                                defaultMessage="Sync Trezor"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'trezor_device_used_elsewhere':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_trezor_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <BoldDangerTriangle
                                size={size}
                                color="statusWarning"
                            />
                        )}
                        title={<Title error={error} />}
                        subtitle={
                            <FormattedMessage
                                id="TrezorError.trezor_device_used_elsewhere.subtitle"
                                defaultMessage="Make sure to close all other open sessions and retry syncing your Trezor"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_trezor_click' })
                            }}
                        >
                            <FormattedMessage
                                id="TrezorError.trezor_device_used_elsewhere.action"
                                defaultMessage="Sync Trezor"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        default:
            return notReachable(error)
    }
}
