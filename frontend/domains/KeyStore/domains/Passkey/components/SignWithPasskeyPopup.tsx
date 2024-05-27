import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { OutlineFingerprint } from '@zeal/uikit/Icon/OutlineFingerprint'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const SignWithPasskeyPopup = ({ onMsg }: Props) => (
    <Popup.Layout onMsg={onMsg}>
        <Header
            icon={({ size, color }) => (
                <OutlineFingerprint size={size} color={color} />
            )}
            title={
                <FormattedMessage
                    id="sign.passkey.title"
                    defaultMessage="Sign with passkey"
                />
            }
            subtitle={
                <FormattedMessage
                    id="sign.passkey.subtitle"
                    defaultMessage="Your browser should prompt you to sign with the passkey associated with this wallet. Please continue there."
                />
            }
        />
    </Popup.Layout>
)
