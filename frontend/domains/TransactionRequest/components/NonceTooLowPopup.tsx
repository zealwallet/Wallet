import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_close_nonce_too_low_modal' }

export const NonceTooLowPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout
            aria-labelledby="nonce-too-low"
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({
                            type: 'on_close_nonce_too_low_modal',
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
        >
            <Header
                titleId="nonce-too-low"
                title={
                    <FormattedMessage
                        id="transaction-request.nonce-too-low.modal.title"
                        defaultMessage="Transaction with same nonce has been completed"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="transaction-request.nonce-too-low.modal.text"
                        defaultMessage="A transaction with the same serial number (nonce) has already been completed, so you can no longer submit this transaction. This can happen if you make transactions close to each other or if you’re trying to speed up or cancel a transaction that has already been completed."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_close_nonce_too_low_modal',
                        })
                    }
                    size="regular"
                >
                    <FormattedMessage
                        id="transaction-request.nonce-too-low.modal.button-text"
                        defaultMessage="Close"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
