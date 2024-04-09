import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { BoldDisconnected } from '@zeal/uikit/Icon/BoldDisconnected'
import { BoldLock as Lock } from '@zeal/uikit/Icon/BoldLock'
import { CloseSquare } from '@zeal/uikit/Icon/CloseSquare'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { LedgerError } from '@zeal/domains/Error/domains/Ledger'

type Props = {
    error: LedgerError
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_ledger_error_close' }
    | { type: 'on_sync_ledger_click' }

export const ErrorPopup = ({ error, onMsg }: Props) => {
    switch (error.type) {
        case 'hardware_wallet_failed_to_open_device':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_ledger_error_close' })
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
                        title={
                            <FormattedMessage
                                id="ledger.error.ledger_not_connected.title"
                                defaultMessage="Ledger is not connected"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="ledger.error.ledger_not_connected.subtitle"
                                defaultMessage="Connect your hardware wallet to your device and open the Ethereum app"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_ledger_click' })
                            }}
                        >
                            <FormattedMessage
                                id="ledger.error.ledger_not_connected.action"
                                defaultMessage="Sync Ledger"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        case 'ledger_not_running_any_app':
        case 'ledger_blind_sign_not_enabled_or_running_non_eth_app':
        case 'ledger_running_non_eth_app':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_ledger_error_close' })
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
                        title={
                            <FormattedMessage
                                id="ledger.error.ledger_running_non_eth_app.title"
                                defaultMessage="Ethereum app not opened"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="ledger.error.ledger_is_locked.subtitle"
                                defaultMessage="Unlock Ledger and open the Ethereum app"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_ledger_click' })
                            }}
                        >
                            <FormattedMessage
                                id="ledger.error.ledger_not_connected.action"
                                defaultMessage="Sync Ledger"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        case 'ledger_is_locked':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_ledger_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <Lock size={size} color="statusWarning" />
                        )}
                        title={
                            <FormattedMessage
                                id="ledger.error.ledger_is_locked.title"
                                defaultMessage="Ledger is locked"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="ledger.error.ledger_is_locked.subtitle"
                                defaultMessage="Unlock Ledger and open the Ethereum app"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_sync_ledger_click' })
                            }}
                        >
                            <FormattedMessage
                                id="ledger.error.ledger_not_connected.action"
                                defaultMessage="Sync Ledger"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        case 'user_trx_denied_by_user':
            return (
                <Popup.Layout
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_ledger_error_close' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <CloseSquare size={size} color="statusWarning" />
                        )}
                        title={
                            <FormattedMessage
                                id="ledger.error.user_trx_denied_by_user.title"
                                defaultMessage="Transaction rejected"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="ledger.error.user_trx_denied_by_user.subtitle"
                                defaultMessage="You rejected the transaction on your hardware wallet"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            onClick={() => {
                                onMsg({ type: 'on_ledger_error_close' })
                            }}
                        >
                            <FormattedMessage
                                id="ledger.error.user_trx_denied_by_user.action"
                                defaultMessage="Close"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
