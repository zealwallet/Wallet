import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ExpirationInfoPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="expiration-info-title">
            <Header
                titleId="expiration-info-title"
                title={
                    <FormattedMessage
                        id="expiration-info.modal.title"
                        defaultMessage="What is expiry time?"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="expiration-info.modal.description"
                        defaultMessage="Expiry time is how long an app can use your tokens. When the time's up, they lose access until you say otherwise. To stay secure, keep expiry time short."
                    />
                }
            />
        </Popup.Layout>
    )
}
