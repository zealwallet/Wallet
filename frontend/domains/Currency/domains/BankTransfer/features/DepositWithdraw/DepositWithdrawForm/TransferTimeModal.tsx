import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const TransferTimeModal = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg}>
        <Header
            title={
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer-time.title"
                    defaultMessage="Transfer time"
                />
            }
            subtitle={
                <FormattedMessage
                    id="bank_transfers.deposit.modal.transfer-time.text"
                    defaultMessage="98% of transfers take less than 1 min to complete.{br}{br}2% of transfers take longer than 1 min because your bank can take time to process the transfer."
                    values={{ br: '\n' }}
                />
            }
        />
    </Popup.Layout>
)
