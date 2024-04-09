import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'
import { Spinner } from '@zeal/uikit/Spinner'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const SignOnHardwareWalletPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                icon={({ size, color }) => (
                    <Spinner size={size} color={color} />
                )}
                title={
                    <FormattedMessage
                        id="sign.ledger.title"
                        defaultMessage="Sign hardware wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="sign.ledger.subtitle"
                        defaultMessage="We sent the transaction request to your hardware wallet. Please continue there."
                    />
                }
            />
        </Popup.Layout>
    )
}
