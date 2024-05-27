import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal as UIModal } from '@zeal/uikit/Modal'
import { QRScanner } from '@zeal/uikit/QRScanner'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { WalletConnectPairingLink } from '@zeal/domains/DApp/domains/WalletConnect'
import { parsePairingLink } from '@zeal/domains/DApp/domains/WalletConnect/parsers/parsePairingLink'

type Props = {
    state: State
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'qr_scanner' }

type Msg =
    | { type: 'close' }
    | { type: 'on_pairing_uri_scanned'; link: WalletConnectPairingLink }
    | Extract<MsgOf<typeof QRScanner>, { type: 'on_permissions_error' }>

export const Modal = ({ state, onMsg }: Props) => {
    const { formatMessage } = useIntl()

    switch (state.type) {
        case 'closed':
            return null

        case 'qr_scanner':
            return (
                <UIModal>
                    <QRScanner
                        labels={{
                            tryAgain: formatMessage({
                                id: 'walletConnect.scan.tryAgain',
                                defaultMessage: 'Try again',
                            }),
                            unlockCamera: formatMessage({
                                id: 'walletConnect.scan.unlockCamera',
                                defaultMessage: 'Unlock camera',
                            }),
                        }}
                        actionBar={
                            <ActionBar
                                left={
                                    <IconButton
                                        variant="on_color"
                                        onClick={() => onMsg({ type: 'close' })}
                                    >
                                        {() => (
                                            <BackIcon
                                                size={24}
                                                color="iconDefaultOnDark"
                                            />
                                        )}
                                    </IconButton>
                                }
                            />
                        }
                        onMsg={async (msg) => {
                            switch (msg.type) {
                                case 'on_qr_code_scanned': {
                                    const parsed = parsePairingLink(msg.data)

                                    switch (parsed.type) {
                                        case 'Failure':
                                            break
                                        case 'Success':
                                            onMsg({
                                                type: 'on_pairing_uri_scanned',
                                                link: parsed.data,
                                            })
                                            break

                                        default:
                                            return notReachable(parsed)
                                    }
                                    break
                                }

                                case 'on_permissions_error':
                                case 'close':
                                    onMsg(msg)
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    >
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textOnDarkPrimary"
                        >
                            <FormattedMessage
                                id="wallet_connect.scan_qr.description"
                                defaultMessage="Scan to connect to a desktop app"
                            />
                        </Text>
                    </QRScanner>
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
