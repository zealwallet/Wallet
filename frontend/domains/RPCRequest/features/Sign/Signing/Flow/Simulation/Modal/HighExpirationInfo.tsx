import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Header } from '@zeal/uikit/Header'
import { BoldShieldCaution } from '@zeal/uikit/Icon/BoldShieldCaution'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'close'
}

export const HighExpirationInfo = ({ onMsg }: Props) => (
    <Popup.Layout
        onMsg={onMsg}
        aria-labelledby="high-expiration-time-modal-title"
    >
        <Header
            titleId="high-expiration-time-modal-title"
            icon={({ size }) => (
                <Avatar
                    size={72}
                    variant="round"
                    backgroundColor="surfaceDefault"
                >
                    <BoldShieldCaution size={size} color="iconStatusWarning" />
                </Avatar>
            )}
            title={
                <FormattedMessage
                    id="expiration-time.high.modal.title"
                    defaultMessage="Long expiry time"
                />
            }
            subtitle={
                <FormattedMessage
                    id="expiration-time.high.modal.text"
                    defaultMessage="Expiry times should be short and based on how long you'll actually need. Long times are risky, giving scammers more chance to misuse your tokens."
                />
            }
        />
    </Popup.Layout>
)
