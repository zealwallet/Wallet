import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_close_transaction_status_not_found_modal' }

export const CouldNotFindTransactionStatus = ({ onMsg }: Props) => {
    return (
        <Popup.Layout
            aria-labelledby="could-not-find-tx-status"
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({
                            type: 'on_close_transaction_status_not_found_modal',
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
        >
            <Header
                titleId="could-not-find-tx-status"
                title={
                    <FormattedMessage
                        id="transaction-request.replaced.modal.title"
                        defaultMessage="Could not find transaction status"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="transaction-request.replaced.modal.text"
                        defaultMessage="We are not able to track the status of this transaction. Either it has been replaced by another transaction or the RPC node is having issues."
                    />
                }
            />
            <Popup.Actions>
                <Button
                    variant="primary"
                    onClick={() =>
                        onMsg({
                            type: 'on_close_transaction_status_not_found_modal',
                        })
                    }
                    size="regular"
                >
                    <FormattedMessage
                        id="transaction-request.replaced.modal.button-text"
                        defaultMessage="Close"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
